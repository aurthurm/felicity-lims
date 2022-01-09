from sqlalchemy.future import select

from .inspection import InspectionMixin
from .session import SessionMixin
from .utils import classproperty


class ModelNotFoundError(ValueError):
    pass


class ActiveRecordMixin(InspectionMixin, SessionMixin):
    __abstract__ = True

    @classproperty
    def settable_attributes(cls):
        return cls.columns + cls.hybrid_properties + cls.settable_relations

    def fill(self, **kwargs):
        for name in kwargs.keys():
            if name in self.settable_attributes:
                setattr(self, name, kwargs[name])
            else:
                raise KeyError("Attribute '{}' doesn't exist".format(name))

        return self

    async def save(self):
        """Saves the updated model to the current entity db.
        """
        self.session.add(self)
        await self.session.flush()
        return self

    @classmethod
    async def create(cls, **kwargs):
        """Create and persist a new record for the model
        :param kwargs: attributes for the record
        :return: the new model instance
        """
        fill = cls().fill(**kwargs)
        created = await fill.save()
        return created

    async def update(self, **kwargs):
        """Same as :meth:`fill` method but persists changes to database.
        """
        fill = self.fill(**kwargs)
        updated = await fill.save()
        return updated

    async def delete(self):
        """Removes the model from the current entity session and mark for deletion.
        """
        await self.session.delete(self)
        await self.session.flush()

    @classmethod
    async def destroy(cls, *ids):
        """Delete the records with the given ids
        :type ids: list
        :param ids: primary key ids of records
        """
        for pk in ids:
            obj = await cls.find(pk)
            if obj:
                await obj.delete()
        await cls.session.flush()

    @classmethod
    async def all(cls):
        result = await cls.session.execute(select(cls))
        _all = result.scalars().all()
        return _all

    @classmethod
    async def first(cls):
        result = await cls.session.execute(select(cls))
        _first = result.scalars().first()
        return _first

    @classmethod
    async def find(cls, id_):
        """Find record by the id
        :param id_: the primary key
        """
        stmt = cls.where(uid=id_)
        results = await cls.session.execute(stmt)
        one_or_none = results.scalars().one_or_none()
        return one_or_none

    @classmethod
    async def find_or_fail(cls, id_):
        # assume that query has custom get_or_fail method
        result = await cls.find(id_)
        if result:
            return result
        else:
            raise ModelNotFoundError(
                "{} with uid '{}' was not found".format(cls.__name__, id_)
            )
