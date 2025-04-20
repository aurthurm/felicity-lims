<template>
  <div class="w-full rounded-lg border border-border bg-card p-4" :class="wrapper">
    <div class="mb-2 flex items-center justify-between">
      <h3 class="text-sm font-medium text-card-foreground">{{ title }}</h3>
      <div class="flex items-center space-x-2">
        <button
          v-if="copyable"
          @click="copyToClipboard"
          class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          :aria-label="copied ? 'Copied to clipboard' : 'Copy to clipboard'"
        >
          <svg
            class="mr-1 h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
            />
          </svg>
          {{ copied ? 'Copied' : 'Copy' }}
        </button>
        <button
          v-if="expandable"
          @click="toggleExpand"
          class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          :aria-expanded="expanded"
          :aria-controls="containerId"
        >
          <svg
            class="mr-1 h-3 w-3 transition-transform duration-200"
            :class="{ 'rotate-180': expanded }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
          {{ expanded ? 'Collapse' : 'Expand' }}
        </button>
      </div>
    </div>
    <div
      ref="jsonContainer"
      :id="containerId"
      class="overflow-auto rounded-md bg-muted p-4 font-mono text-sm"
      :class="{ 'max-h-96': !expanded }"
      role="region"
      :aria-label="`JSON preview of ${title}`"
      tabindex="0"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

interface Props {
  data: any;
  wrapper?: string;
  copyable?: boolean;
  expandable?: boolean;
  theme?: 'light' | 'dark';
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  wrapper: '',
  copyable: true,
  expandable: true,
  theme: 'light',
  title: 'JSON Preview'
});

const jsonContainer = ref<HTMLElement | null>(null);
const expanded = ref(false);
const copied = ref(false);
const containerId = `json-preview-${Math.random().toString(36).slice(2, 11)}`;

function toggleExpand() {
  expanded.value = !expanded.value;
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(JSON.stringify(props.data, null, 2));
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
}

function renderJson(data: any, container: HTMLElement) {
  const theme = props.theme === 'dark' ? 'dark' : 'light';
  const jsonViewer = new JsonViewer({
    container,
    data: JSON.stringify(data),
    theme,
    expand: expanded.value
  });
}

watch(
  () => props.data,
  (newData) => {
    if (jsonContainer.value) {
      jsonContainer.value.innerHTML = '';
      if (newData && Object.keys(newData).length > 0) {
        renderJson(newData, jsonContainer.value);
      }
    }
  },
  { immediate: true }
);

watch(
  () => expanded.value,
  (newValue) => {
    if (jsonContainer.value && props.data) {
      jsonContainer.value.innerHTML = '';
      renderJson(props.data, jsonContainer.value);
    }
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

class JsonViewer {
  private options: {
    theme: string;
    container: HTMLElement;
    data: string;
    expand: boolean;
  };

  constructor(options: {
    theme: string;
    container: HTMLElement;
    data: string;
    expand: boolean;
  }) {
    const defaults = {
      theme: "light",
      container: null,
      data: "{}",
      expand: false,
    };
    this.options = Object.assign(defaults, options);
    if (!options.container) {
      throw new Error("Container: dom element is required");
    }
    this.render();
  }

  private renderRight(theme: string, right: HTMLElement, val: any): void {
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
  }

  private renderChildren(
    theme: string,
    key: string,
    val: any,
    right: HTMLElement,
    indent: number,
    left: HTMLElement
  ): void {
    const folder = this.createElement("span");
    const rotate90 = this.options.expand ? "rotate90" : "";
    const addHeight = this.options.expand ? "add-height" : "";
    folder.setAttribute("class", theme + "folder " + rotate90);
    folder.onclick = (e: MouseEvent) => {
      const nextSibling = (e.target as HTMLElement).parentNode?.nextSibling as HTMLElement;
      this.toggleItem(nextSibling, e.target as HTMLElement);
    };
    const len = isObject(val) ? Object.keys(val).length : val.length;
    left.innerHTML = isObject(val)
      ? key + "&nbsp;&nbsp{" + len + "}"
      : key + "&nbsp;&nbsp[" + len + "]";
    left.prepend(folder);
    right.setAttribute("class", theme + "rightObj " + addHeight);
    this.parse(val, right, indent + 0, theme);
  }

  private parse(
    dataObj: any,
    parent: HTMLElement,
    indent: number,
    theme: string
  ): void {
    this.forEach(dataObj, (val: any, key: string) => {
      const { left, right } = this.createItem(
        indent,
        theme,
        parent,
        key,
        typeof val !== "object"
      );
      if (typeof val !== "object") {
        this.renderRight(theme, right, val);
      } else {
        this.renderChildren(theme, key, val, right, indent, left);
      }
    });
  }

  private createItem(
    indent: number,
    theme: string,
    parent: HTMLElement,
    key: string,
    basicType: boolean
  ): {
    left: HTMLElement;
    right: HTMLElement;
    current: HTMLElement;
  } {
    const current = this.createElement("div");
    const left = this.createElement("div");
    const right = this.createElement("div");
    const wrap = this.createElement("div");

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
      left.onclick = (e: MouseEvent) => {
        const nextSibling = (e.target as HTMLElement).nextSibling as HTMLElement;
        this.toggleItem(nextSibling, (e.target as HTMLElement).querySelector("span") as HTMLElement);
      };
    }

    return {
      left,
      right,
      current,
    };
  }

  private render(): void {
    const data = this.options.data;
    const theme = "jv-" + this.options.theme + "-";
    const indent = 0;
    const parent = this.options.container;
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
    const { left, right } = this.createItem(indent, theme, parent, key, false);
    this.renderChildren(theme, key, dataObj, right, indent, left);
  }

  private toggleItem(ele: HTMLElement, target: HTMLElement): void {
    ele.classList.toggle("add-height");
    target.classList.toggle("rotate90");
  }

  private createElement(type: string): HTMLElement {
    return document.createElement(type);
  }

  private forEach(obj: any, fn: (val: any, key: string, obj: any) => void): void {
    if (isUndefined(obj) || isNull(obj)) {
      return;
    }
    if (typeof obj === "object" && isArray(obj)) {
      for (let i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i.toString(), obj);
      }
    } else {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          fn.call(null, obj[key], key, obj);
        }
      }
    }
  }
}
</script>

<style>
.jv-light-con {
  @apply text-foreground;
}

.jv-light-current {
  @apply flex items-start;
}

.jv-light-left {
  @apply text-muted-foreground;
}

.jv-light-right {
  @apply ml-2;
}

.jv-light-rightNumber {
  @apply text-primary;
}

.jv-light-rightBoolean {
  @apply text-secondary;
}

.jv-light-rightNull {
  @apply text-destructive;
}

.jv-light-rightString {
  @apply text-accent-foreground;
}

.jv-light-folder {
  @apply cursor-pointer hover:text-foreground;
}

.jv-light-symbol {
  @apply text-muted-foreground;
}

.jv-dark-con {
  @apply text-foreground;
}

.jv-dark-current {
  @apply flex items-start;
}

.jv-dark-left {
  @apply text-muted-foreground;
}

.jv-dark-right {
  @apply ml-2;
}

.jv-dark-rightNumber {
  @apply text-primary;
}

.jv-dark-rightBoolean {
  @apply text-secondary;
}

.jv-dark-rightNull {
  @apply text-destructive;
}

.jv-dark-rightString {
  @apply text-accent-foreground;
}

.jv-dark-folder {
  @apply cursor-pointer hover:text-foreground;
}

.jv-dark-symbol {
  @apply text-muted-foreground;
}

.rotate90 {
  @apply rotate-90 transform transition-transform duration-200;
}

.add-height {
  @apply h-auto;
}

.jv-light-folder,
.jv-dark-folder {
  @apply cursor-pointer hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring;
}

.jv-light-current,
.jv-dark-current {
  @apply flex items-start focus-within:outline-none focus-within:ring-2 focus-within:ring-ring;
}

.jv-light-left,
.jv-dark-left {
  @apply text-muted-foreground focus:outline-none focus:text-foreground;
}

.jv-wrap {
  @apply flex items-start gap-2;
}
</style>
