<template>
  <div :class="wrapper">
    <transition name="bounce">
      <div id="jsonPreview"></div>
    </transition>
  </div>
</template>

<script setup>
import { watch } from "vue";
const props = defineProps(["data", "wrapper"]);

watch(
  () => props.data,
  (n, o) => {
    document.getElementById("jsonPreview").innerHTML = "";
    if (n.length === 0) return;
    new JsonViewer({
      container: document.getElementById("jsonPreview"),
      data: JSON.stringify(props.data),
      theme: "light",
      expand: false,
    });
  }
);

const toString = Object.prototype.toString;

function isNumber(val) {
  return typeof val === "number";
}

function isBoolean(val) {
  return typeof val === "boolean";
}

function isUndefined(val) {
  return typeof val === "undefined";
}

function isArray(val) {
  return toString.call(val) === "[object Array]";
}

function isObject(val) {
  return toString.call(val) === "[object Object]";
}

function isNull(val) {
  return toString.call(val) === "[object Null]";
}

function JsonViewer(options) {
  const defaults = {
    theme: "light",
    container: null,
    data: "{}",
    expand: false,
  };
  this.options = Object.assign(defaults, options);
  if (isNull(options.container)) {
    throw new Error("Container: dom element is required");
  }
  this.render();
}

JsonViewer.prototype.renderRight = function (theme, right, val) {
  if (isNumber(val)) {
    right.setAttribute("class", theme + "rightNumber");
  } else if (isBoolean(val)) {
    right.setAttribute("class", theme + "rightBoolean");
  } else if (val === "null") {
    right.setAttribute("class", theme + "rightNull");
  } else {
    right.setAttribute("class", theme + "rightString");
  }
  right.innerText = val;
};

JsonViewer.prototype.renderChildren = function (theme, key, val, right, indent, left) {
  let self = this;
  let folder = this.createElement("span");
  let rotate90 = this.options.expand ? "rotate90" : "";
  let addHeight = this.options.expand ? "add-height" : "";
  folder.setAttribute("class", theme + "folder " + rotate90);
  folder.onclick = function (e) {
    let nextSibling = e.target.parentNode.nextSibling;
    self.toggleItem(nextSibling, e.target);
  };
  let len = 0;
  let isObj = false;
  if (isObject(val)) {
    len = Object.keys(val).length;
    isObj = true;
  } else {
    len = val.length;
  }
  left.innerHTML = isObj
    ? key + "&nbsp;&nbsp{" + len + "}"
    : key + "&nbsp;&nbsp[" + len + "]";
  left.prepend(folder);
  right.setAttribute("class", theme + "rightObj " + addHeight);
  self.parse(val, right, indent + 0, theme);
};

JsonViewer.prototype.parse = function (dataObj, parent, indent, theme) {
  const self = this;
  this.forEach(dataObj, function (val, key) {
    const { left, right } = self.createItem(
      indent,
      theme,
      parent,
      key,
      typeof val !== "object"
    );
    if (typeof val !== "object") {
      self.renderRight(theme, right, val);
    } else {
      self.renderChildren(theme, key, val, right, indent, left);
    }
  });
};

JsonViewer.prototype.createItem = function (indent, theme, parent, key, basicType) {
  let self = this;
  let current = this.createElement("div");
  let left = this.createElement("div");
  let right = this.createElement("div");
  let wrap = this.createElement("div");

  current.style.marginLeft = indent * 2 + "px";
  left.innerHTML = `${key}<span class="jv-${theme}-symbol">&nbsp;:&nbsp;</span>`;
  if (basicType) {
    current.appendChild(wrap);
    wrap.appendChild(left);
    wrap.appendChild(right);
    parent.appendChild(current);
    current.setAttribute("class", theme + "current");
    wrap.setAttribute("class", "jv-wrap");
    left.setAttribute("class", theme + "left");
  } else {
    current.appendChild(left);
    current.appendChild(right);
    parent.appendChild(current);
    current.setAttribute("class", theme + "current");
    left.setAttribute("class", theme + "left jv-folder");
    left.onclick = function (e) {
      let nextSibling = e.target.nextSibling;
      self.toggleItem(nextSibling, e.target.querySelector("span"));
    };
  }

  return {
    left,
    right,
    current,
  };
};

JsonViewer.prototype.render = function () {
  let data = this.options.data;
  let theme = "jv-" + this.options.theme + "-";
  let indent = 0;
  let parent = this.options.container;
  let key = "object";
  let dataObj;

  parent.setAttribute("class", theme + "con");
  try {
    dataObj = JSON.parse(data);
  } catch (error) {
    throw new Error("It is not a json format");
  }
  if (isArray(dataObj)) {
    key = "array";
  }
  const { left, right } = this.createItem(indent, theme, parent, key);
  this.renderChildren(theme, key, dataObj, right, indent, left);
};

JsonViewer.prototype.toggleItem = function (ele, target) {
  ele.classList.toggle("add-height");
  target.classList.toggle("rotate90");
};

JsonViewer.prototype.createElement = function (type) {
  return document.createElement(type);
};

JsonViewer.prototype.forEach = function (obj, fn) {
  if (isUndefined(obj) || isNull(obj)) {
    return;
  }
  if (typeof obj === "object" && isArray(obj)) {
    for (let i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        fn.call(null, obj[key] ?? "null", key, obj);
      }
    }
  }
};
</script>

<style>
.add-height {
  height: auto !important;
}

.rotate90 {
  transform: rotate(0deg) !important;
}

.jv-wrap {
  display: flex;
}

.jv-folder {
  cursor: pointer;
}

/* for light them */

.jv-light-symbol {
  color: #000;
  font-weight: bold;
}

.jv-light-con {
  background: #fff;
  color: #000;
  font-family: monospace;
  overflow: auto;
  height: 100%;
  width: 100%;
}

.jv-light-current {
  line-height: 30px;
  padding-left: 20px;
  position: relative;
}

.jv-light-left {
  display: inline-block;
}

.jv-light-rightString {
  display: inline-block;
  color: #7a3e9d;
}

.jv-light-rightBoolean {
  display: inline-block;
  color: #448c27;
}

.jv-light-rightNumber {
  display: inline-block;
  color: #f53232;
}

.jv-light-rightNull {
  display: inline-block;
  color: #9c5d27;
}

.jv-light-rightObj {
  display: block !important;
  overflow: hidden;
  height: 0;
}

.jv-light-folder {
  width: 0px;
  display: inline-block;
  margin-left: -15px;
  text-align: center;
  cursor: pointer;
  height: 0px;
  border: 4px solid transparent;
  border-top: 8px solid #484d50;
  position: absolute;
  top: 11px;
  transform-origin: 50% 25%;
  transform: rotate(-90deg);
}

/* for dark theme */

.jv-dark-con {
  background: #272822;
  color: #fff;
  font-family: monospace;
  overflow: auto;
  height: 100%;
  width: 100%;
}

.jv-dark-symbol {
  color: #fff;
  font-weight: bold;
}

.jv-dark-current {
  line-height: 30px;
  padding-left: 20px;
  position: relative;
}

.jv-dark-left {
  display: inline-block;
}

.jv-dark-rightString {
  display: inline-block;
  color: #66d9ef;
}

.jv-dark-rightBoolean {
  display: inline-block;
  color: #a6e22e;
}

.jv-dark-rightNumber {
  display: inline-block;
  color: #f92672;
}

.jv-dark-rightNull {
  display: inline-block;
  color: #e6db74;
}

.jv-dark-rightObj {
  display: block !important;
  overflow: hidden;
  height: 0;
}

.jv-dark-folder {
  width: 0px;
  display: inline-block;
  margin-left: -15px;
  text-align: center;
  cursor: pointer;
  height: 0px;
  border: 4px solid transparent;
  border-top: 8px solid #fff;
  position: absolute;
  top: 11px;
  transform: rotate(-90deg);
  transform-origin: 50% 25%;
}
</style>
