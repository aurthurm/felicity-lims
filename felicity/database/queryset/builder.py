from collections import abc, OrderedDict
from typing import TypeVar

from sqlalchemy import asc, desc, inspect, select
from sqlalchemy.ext.hybrid import hybrid_property, hybrid_method
from sqlalchemy.orm import RelationshipProperty
from sqlalchemy.orm import aliased
from sqlalchemy.orm import joinedload
from sqlalchemy.orm import subqueryload
from sqlalchemy.orm.state import InstanceState
from sqlalchemy.orm.util import AliasedClass
from sqlalchemy.sql import operators, extract
from sqlalchemy_mixins import InspectionMixin

M = TypeVar("M")

JOINED = "joined"
SUBQUERY = "subquery"

RELATION_SPLITTER = "___"
OPERATOR_SPLITTER = "__"

DESC_PREFIX = "-"


class ModelNotFoundError(ValueError):
    pass


def _flatten_filter_keys(filters):
    """
    :type filters: dict|list
    Flatten the nested filters, extracting keys where they correspond
    to smart_query paths, e.g.
    {or_: {'id__gt': 1000, and_ : {
        'id__lt': 500,
        'related___property__in': (1,2,3)
    }}}

    Yields:

    'id__gt', 'id__lt', 'related___property__in'

    Also allow lists (any abc.Sequence subclass) to enable support
    of expressions like.

    (X OR Y) AND (W OR Z)

    { and_: [
        {or_: {'id__gt': 5, 'related_id__lt': 10}},
        {or_: {'related_id2__gt': 1, 'name__like': 'Bob' }}
    ]}
    """

    if isinstance(filters, abc.Mapping):
        for key, value in filters.items():
            if callable(key):
                yield from _flatten_filter_keys(value)
            else:
                yield key

    elif isinstance(filters, abc.Sequence):
        for f in filters:
            yield from _flatten_filter_keys(f)

    else:
        raise TypeError(
            "Unsupported type (%s) in filters: %r", (type(filters), filters)
        )


def _parse_path_and_make_aliases(entity, entity_path, attrs, aliases):
    """
    :type entity: InspectionMixin
    :type entity_path: str
    :type attrs: list
    :type aliases: OrderedDict

    Sample values:

    attrs: ['product__subject_ids', 'user_id', '-group_id',
            'user__name', 'product__name', 'product__grade_from__order']
    relations: {'product': ['subject_ids', 'name'], 'user': ['name']}

    """
    relations = {}
    # take only attributes that have magic RELATION_SPLITTER
    for attr in attrs:
        # from attr (say, 'product__grade__order')  take
        # relationship name ('product') and nested attribute ('grade__order')
        if RELATION_SPLITTER in attr:
            relation_name, nested_attr = attr.split(RELATION_SPLITTER, 1)
            if relation_name in relations:
                relations[relation_name].append(nested_attr)
            else:
                relations[relation_name] = [nested_attr]

    for relation_name, nested_attrs in relations.items():
        path = (
            entity_path + RELATION_SPLITTER + relation_name
            if entity_path
            else relation_name
        )
        if relation_name not in entity.relations:
            raise KeyError(
                "Incorrect path `{}`: "
                "{} doesnt have `{}` relationship ".format(path, entity, relation_name)
            )
        relationship = getattr(entity, relation_name)
        alias = aliased(relationship.property.mapper.class_)
        aliases[path] = alias, relationship
        _parse_path_and_make_aliases(alias, path, nested_attrs, aliases)


def _get_root_cls(query):
    # sqlalchemy < 1.4.0
    if hasattr(query, "_entity_zero"):
        return query._entity_zero().class_

    # sqlalchemy >= 1.4.0
    else:
        if hasattr(query, "_entity_from_pre_ent_zero"):
            return query._entity_from_pre_ent_zero().class_

        # sqlalchemy 2.x
        else:
            if query.__dict__["_propagate_attrs"]["plugin_subject"].class_:
                return query.__dict__["_propagate_attrs"]["plugin_subject"].class_

    raise ValueError("Cannot get a root class from`{}`".format(query))


def filter_expr(model, **filters):
    """
    forms expressions like [Product.age_from = 5,
                            Product.subject_ids.in_([1,2])]
    from filters like {'age_from': 5, 'subject_ids__in': [1,2]}

    Example 1:
        db.query(Product).filter(
            *Product.filter_expr(age_from = 5, subject_ids__in=[1, 2]))

    Example 2:
        filters = {'age_from': 5, 'subject_ids__in': [1,2]}
        db.query(Product).filter(*Product.filter_expr(**filters))


    ### About alias ###:
    If we will use alias:
        alias = aliased(Product) # table name will be product_1
    we can't just write query like
        db.query(alias).filter(*Product.filter_expr(age_from=5))
    because it will be compiled to
        SELECT * FROM product_1 WHERE product.age_from=5
    which is wrong: we select from 'product_1' but filter on 'product'
    such filter will not work

    We need to obtain
        SELECT * FROM product_1 WHERE product_1.age_from=5
    For such case, we can call filter_expr ON ALIAS:
        alias = aliased(Product)
        db.query(alias).filter(*alias.filter_expr(age_from=5))

    Alias realization details:
      * we allow to call this method
        either ON ALIAS (say, alias.filter_expr())
        or on class (Product.filter_expr())
      * when method is called on alias, we need to generate SQL using
        aliased table (say, product_1), but we also need to have a real
        class to call methods on (say, Product.relations)
      * so, we have 'mapper' that holds table name
        and 'cls' that holds real class

        when we call this method ON ALIAS, we will have:
            mapper = <product_1 table>
            cls = <Product>
        when we call this method ON CLASS, we will simply have:
            mapper = <Product> (or we could write <Product>.__mapper__.
                                It doesn't matter because when we call
                                <Product>.getattr, SA will magically
                                call <Product>.__mapper__.getattr())
            cls = <Product>
    """
    if isinstance(model, AliasedClass):
        mapper, cls = model, inspect(model).mapper.class_
    else:
        mapper = cls = model

    expressions = []
    valid_attributes = filterable_attributes(model)
    for attr, value in filters.items():
        # if attribute is filtered by method, call this method
        if attr in hybrid_methods(model):
            method = getattr(cls, attr)
            expressions.append(method(value, mapper=mapper))
        # else just add simple condition (== for scalars or IN for lists)
        else:
            # determine attrbitute name and operator
            # if they are explicitly set (say, id___between), take them
            if OPERATOR_SPLITTER in attr:
                attr_name, op_name = attr.rsplit(OPERATOR_SPLITTER, 1)
                if op_name not in _operators:
                    raise KeyError(
                        "Expression `{}` has incorrect "
                        "operator `{}`".format(attr, op_name)
                    )
                op = _operators[op_name]
            # assume equality operator for other cases (say, id=1)
            else:
                attr_name, op = attr, operators.eq

            if attr_name not in valid_attributes:
                raise KeyError(
                    "Expression `{}` "
                    "has incorrect attribute `{}`".format(attr, attr_name)
                )

            column = getattr(mapper, attr_name)
            expressions.append(op(column, value))

    return expressions


def smart_query(query, filters=None, sort_attrs=None, schema=None):
    """
    Does magic Django-ish joins like post___user___name__startswith='Bob'
     (see https://goo.gl/jAgCyM)
    Does filtering, sorting and eager loading at the same time.
    And if, say, filters and sorting need the same joinm it will be done
     only one. That's why all stuff is combined in single method

    :param query: sqlalchemy.orm.query.Query
    :param filters: dict
    :param sort_attrs: List[basestring]
    :param schema: dict
    """
    if not filters:
        filters = {}
    if not sort_attrs:
        sort_attrs = []

    # sqlalchemy >= 1.4.0, should probably a. check something else to determine if we need to convert
    # AppenderQuery to a query, b. probably not hack it like this
    # noinspection PyProtectedMember
    if type(query).__name__ == "AppenderQuery" and query._statement:
        sess = query.session
        # noinspection PyProtectedMember
        query = query._statement
        query.session = sess

    root_cls = _get_root_cls(query)  # for example, User or Post
    attrs = list(_flatten_filter_keys(filters)) + list(
        map(lambda s: s.lstrip(DESC_PREFIX), sort_attrs)
    )
    aliases = OrderedDict({})
    _parse_path_and_make_aliases(root_cls, "", attrs, aliases)

    loaded_paths = []
    for path, al in aliases.items():
        relationship_path = path.replace(RELATION_SPLITTER, ".")
        query = query.outerjoin(al[0], al[1])
        loaded_paths.append(relationship_path)

    def recurse_filters(_filters):
        if isinstance(_filters, abc.Mapping):
            for attr, value in _filters.items():
                if callable(attr):
                    # E.g. or_, and_, or other sqlalchemy expression
                    yield attr(*recurse_filters(value))
                    continue
                if RELATION_SPLITTER in attr:
                    parts = attr.rsplit(RELATION_SPLITTER, 1)
                    entity, attr_name = aliases[parts[0]][0], parts[1]
                else:
                    entity, attr_name = root_cls, attr
                try:
                    yield from filter_expr(entity, **{attr_name: value})
                except KeyError as e:
                    raise KeyError("Incorrect filter path `{}`: {}".format(attr, e))

        elif isinstance(_filters, abc.Sequence):
            for f in _filters:
                yield from recurse_filters(f)

    query = query.filter(*recurse_filters(filters))

    for attr in sort_attrs:
        if RELATION_SPLITTER in attr:
            prefix = ""
            if attr.startswith(DESC_PREFIX):
                prefix = DESC_PREFIX
                attr = attr.lstrip(DESC_PREFIX)
            parts = attr.rsplit(RELATION_SPLITTER, 1)
            entity, attr_name = aliases[parts[0]][0], prefix + parts[1]
        else:
            entity, attr_name = root_cls, attr
        try:
            query = query.order_by(*order_expr(entity, attr_name))
        except KeyError as e:
            raise KeyError("Incorrect order path `{}`: {}".format(attr, e))

    if schema:
        query = query.options(*_eager_expr_from_schema(schema))

    return query


def eager_expr(schema):
    """
    :type schema: dict
    """
    return _eager_expr_from_schema(schema)


def _flatten_schema(schema):
    """
    :type schema: dict
    """

    def _flatten(schema, parent_path, result):
        """
        :type schema: dict
        """
        for path, value in schema.items():
            # for supporting schemas like Product.user: {...},
            # we transform, say, Product.user to 'user' string
            attr = path
            path = path.key

            if isinstance(value, tuple):
                join_method, inner_schema = value[0], value[1]
            elif isinstance(value, dict):
                join_method, inner_schema = JOINED, value
            else:
                join_method, inner_schema = value, None

            full_path = parent_path + "." + path if parent_path else path
            result[attr] = join_method

            if inner_schema:
                _flatten(inner_schema, full_path, result)

    result = {}
    _flatten(schema, "", result)
    return result


def _eager_expr_from_flat_schema(flat_schema):
    """
    :type flat_schema: dict
    """
    result = []
    for path, join_method in flat_schema.items():
        if join_method == JOINED:
            result.append(joinedload(path))
        elif join_method == SUBQUERY:
            result.append(subqueryload(path))
        else:
            raise ValueError("Bad join method `{}` in `{}`".format(join_method, path))
    return result


def _eager_expr_from_schema(schema):
    def _get_expr(schema, result):
        for path, value in schema.items():
            if isinstance(value, tuple):
                join_method, inner_schema = value[0], value[1]
                load_option = _create_eager_load_option(path, join_method)
                result.append(
                    load_option.options(*_eager_expr_from_schema(inner_schema))
                )
            elif isinstance(value, dict):
                join_method, inner_schema = JOINED, value
                load_option = _create_eager_load_option(path, join_method)
                result.append(
                    load_option.options(*_eager_expr_from_schema(inner_schema))
                )
                # load_option = _create_eager_load_option(path, value)
            else:
                result.append(_create_eager_load_option(path, value))

    result = []
    _get_expr(schema, result)
    return result


def _create_eager_load_option(path, join_method):
    if join_method == JOINED:
        return joinedload(path)
    elif join_method == SUBQUERY:
        return subqueryload(path)
    else:
        raise ValueError("Bad join method `{}` in `{}`".format(join_method, path))


def order_expr(model, *columns):
    """
    Forms expressions like [desc(User.first_name), asc(User.phone)]
      from list like ['-first_name', 'phone']

    Example for 1 column:
      db.query(User).order_by(*User.order_expr('-first_name'))
      # will compile to ORDER BY user.first_name DESC

    Example for multiple columns:
      columns = ['-first_name', 'phone']
      db.query(User).order_by(*User.order_expr(*columns))
      # will compile to ORDER BY user.first_name DESC, user.phone ASC

    About cls_or_alias, mapper, cls: read in filter_expr method description
    """

    expressions = []
    for attr in columns:
        fn, attr = (desc, attr[1:]) if attr.startswith(DESC_PREFIX) else (asc, attr)
        if attr not in sortable_attributes(model):
            raise KeyError("Cant order {} by {}".format(model, attr))

        expr = fn(getattr(model, attr))
        expressions.append(expr)
    return expressions


_operators = {
    "isnull": lambda c, v: (c == None) if v else (c != None),
    "exact": operators.eq,
    "ne": operators.ne,  # not equal or is not (for None)
    "gt": operators.gt,  # greater than , >
    "ge": operators.ge,  # greater than or equal, >=
    "lt": operators.lt,  # lower than, <
    "le": operators.le,  # lower than or equal, <=
    "in": operators.in_op,
    "notin": operators.notin_op,
    "between": lambda c, v: c.between(v[0], v[1]),
    "like": operators.like_op,
    "ilike": operators.ilike_op,
    "startswith": operators.startswith_op,
    "istartswith": lambda c, v: c.ilike(v + "%"),
    "endswith": operators.endswith_op,
    "iendswith": lambda c, v: c.ilike("%" + v),
    "contains": lambda c, v: c.ilike("%{v}%".format(v=v)),
    "year": lambda c, v: extract("year", c) == v,
    "year_ne": lambda c, v: extract("year", c) != v,
    "year_gt": lambda c, v: extract("year", c) > v,
    "year_ge": lambda c, v: extract("year", c) >= v,
    "year_lt": lambda c, v: extract("year", c) < v,
    "year_le": lambda c, v: extract("year", c) <= v,
    "month": lambda c, v: extract("month", c) == v,
    "month_ne": lambda c, v: extract("month", c) != v,
    "month_gt": lambda c, v: extract("month", c) > v,
    "month_ge": lambda c, v: extract("month", c) >= v,
    "month_lt": lambda c, v: extract("month", c) < v,
    "month_le": lambda c, v: extract("month", c) <= v,
    "day": lambda c, v: extract("day", c) == v,
    "day_ne": lambda c, v: extract("day", c) != v,
    "day_gt": lambda c, v: extract("day", c) > v,
    "day_ge": lambda c, v: extract("day", c) >= v,
    "day_lt": lambda c, v: extract("day", c) < v,
    "day_le": lambda c, v: extract("day", c) <= v,
}


def _klass(obj):
    if isinstance(inspect(obj), InstanceState):  # type(inspect(obj)) ==InstanceState
        return obj._sa_instance_state.mapper.class_
    return obj


def columns(model):
    """classproperty"""
    cls = _klass(model)
    return inspect(cls).columns.keys()


def primary_keys_full(model):
    """classproperty
    Get primary key properties for a SQLAlchemy cls.
    Taken from marshmallow_sqlalchemy
    """
    cls = _klass(model)
    mapper = cls.__mapper__
    return [mapper.get_property_by_column(column) for column in mapper.primary_key]


def primary_keys(model):
    """classproperty"""
    cls = _klass(model)
    return [pk.key for pk in primary_keys_full(cls)]


def relations(model):
    """classproperty
    Return a `list` of relationship names or the given model"""
    cls = _klass(model)
    return [
        c.key for c in cls.__mapper__.attrs if isinstance(c, RelationshipProperty)
    ]


def settable_relations(model):
    """classproperty
    Return a `list` of relationship names or the given model"""
    cls = _klass(model)
    return [r for r in relations(cls) if getattr(model, r).property.viewonly is False]


def hybrid_properties(model):
    """classproperty"""
    cls = _klass(model)
    items = inspect(cls).all_orm_descriptors
    return [item.__name__ for item in items if isinstance(item, hybrid_property)]


def hybrid_methods_full(model):
    """classproperty"""
    cls = _klass(model)
    items = inspect(cls).all_orm_descriptors
    return {item.func.__name__: item for item in items if type(item) == hybrid_method}


def hybrid_methods(model):
    """classproperty"""
    cls = _klass(model)
    return list(hybrid_methods_full(cls).keys())


def filterable_attributes(model):
    cls = _klass(model)
    return (
            relations(cls)
            + columns(cls)
            + hybrid_properties(cls)
            + hybrid_methods(cls)
    )


def sortable_attributes(model):
    cls = _klass(model)
    return columns(cls) + hybrid_properties(cls)


def settable_attributes(model):
    cls = _klass(model)
    return sortable_attributes(cls) + settable_relations(cls)


class QueryBuilder:
    def __init__(self, model: M) -> None:
        self.model = model

    @property
    def query(self):
        return select(self.model)

    def with_(self, schema):
        """
        Query class and eager load schema at once.
        :type schema: dict

        Example:
            schema = {
                Post.user: JOINED,  # joinedload user
                Post.comments: (SUBQUERY, { # load comments in separate query
                    Comment.user: JOINED  # but, in this separate query, join user
                })
            }
            User.with_(schema).first()
        """
        return self.query.options(*eager_expr(schema or {}))

    def with_joined(self, *paths):
        """
        Eagerload for simple cases where we need to just
         joined load some relations
        You can only load direct relationships.

        :type paths: *List[QueryableAttribute]

        Example 1:
            Comment.with_joined(Comment.user, Comment.post).first()
        """
        options = [joinedload(path) for path in paths]
        return self.query.options(*options)

    def with_subquery(self, *paths):
        """
        Eagerload for simple cases where we need to just
         joined load some relations
        You can only load direct relationships.

        :type paths: *List[QueryableAttribute]

        Example 1:
            User.with_subquery(User.posts, User.comments).all()
        """
        options = [subqueryload(path) for path in paths]
        return self.query.options(*options)

    def smart_query(self, filters=None, sort_attrs=None, schema=None):
        """
        Does magic Django-ish joins like post___user___name__startswith='Bob'
         (see https://goo.gl/jAgCyM)
        Does filtering, sorting and eager loading at the same time.
        And if, say, filters and sorting need the same joinm it will be done
         only one. That's why all stuff is combined in single method

        :param filters: dict
        :param sort_attrs: List[basestring]
        :param schema: dict
        """
        return smart_query(self.query, filters, sort_attrs, schema)

    def where(self, **filters):
        """
        Shortcut for smart_query() method
        Example 1:
          Product.where(subject_ids__in=[1,2], grade_from_id=2).all()

        Example 2:
          filters = {'subject_ids__in': [1,2], 'grade_from_id': 2}
          Product.where(**filters).all()

        Example 3 (with joins):
          Post.where(public=True, user___name__startswith='Bi').all()
        """
        return self.smart_query(filters)

    def sort(self, *columns):
        """
        Shortcut for smart_query() method
        Example 1:
            User.sort('first_name','-user_id')
        This is equal to
            db.query(User).order_by(*User.order_expr('first_name','-user_id'))

        Example 2:
            columns = ['first_name','-user_id']
            User.sort(*columns)
        This is equal to
            columns = ['first_name','-user_id']
            db.query(User).order_by(*User.order_expr(*columns))

        Exanple 3 (with joins):
            Post.sort('comments___rating', 'user___name').all()
        """
        return self.smart_query({}, columns)

    async def fill(self, **kwargs):
        model = self.model
        for name in kwargs.keys():
            if name in settable_attributes(model):
                setattr(model, name, kwargs[name])
            else:
                raise KeyError("Attribute '{}' doesn't exist".format(name))

        return model
