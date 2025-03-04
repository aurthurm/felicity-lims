<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Document } from '@/stores/documentStore';
import { UmoEditor } from '@umoteam/editor'; // eslint-disable-line
import { ArrowLeftIcon, DocumentDuplicateIcon, EyeIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const route = useRoute();
const documentId = computed(() => route.params.documentId as string);

const document = ref<Document | null>(null);
const editorContent = ref(null);
const isSaving = ref(false);
const saveMessage = ref('');

// Mock documents data (in a real app, this would come from a store or API)
const documents = ref<Document[]>([
  { 
    id: '1', 
    name: 'Meeting Notes', 
    content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Meeting notes content' }] }] }, 
    folderId: '2', 
    createdAt: new Date(), 
    updatedAt: new Date() 
  },
  { 
    id: '2', 
    name: 'Project Plan', 
    content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Project plan content' }] }] }, 
    folderId: '3', 
    createdAt: new Date(), 
    updatedAt: new Date() 
  },
  { 
    id: '3', 
    name: 'Personal Notes', 
    content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Personal notes content' }] }] }, 
    folderId: '1', 
    createdAt: new Date(), 
    updatedAt: new Date() 
  },
]);

// Load document
onMounted(() => {
  const doc = documents.value.find(d => d.id === documentId.value);
  if (doc) {
    document.value = { ...doc };
    editorContent.value = doc.content;
  } else {
    router.push('/');
  }
});

// Save document
function saveDocument() {
  if (!document.value || !editorContent.value) return;
  
  isSaving.value = true;
  
  // Update document content
  document.value.content = editorContent.value;
  document.value.updatedAt = new Date();
  
  // Update document in the list
  const index = documents.value.findIndex(d => d.id === document.value?.id);
  if (index !== -1) {
    documents.value[index] = { ...document.value };
  }
  
  // Show save message
  saveMessage.value = 'Document saved';
  setTimeout(() => {
    saveMessage.value = '';
  }, 3000);
  
  isSaving.value = false;
}

// Handle content change
function handleContentChange(content: any) {
  editorContent.value = content;
}

// Go back to dashboard
function goBack() {
  router.back();
}

// Duplicate document
function duplicateDocument() {
  if (!document.value) return;
  
  const newDoc: Document = {
    ...document.value,
    id: Date.now().toString(),
    name: `${document.value.name} (Copy)`,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  documents.value.push(newDoc);
  router.push({ name: 'document-editor', params: { id: newDoc.id } });
}

// Preview document
function previewDocument() {
  if (!document.value) return;
  router.push({ name: 'document-preview', params: { id: document.value.id } });
}

// Uomo edirttor options
const umoOptions = ref({
  "editorKey": "felicity-dms",
  "locale": "en-US",
  "theme": "light",
  "height": "100%",
  "dicts": {
    "fonts": [
      {
        "label": {
          "en_US": "Default Font",
          "zh_CN": "默认字体",
          "ru_RU": "default"
        },
        "value": null
      },
      {
        "label": {
          "en_US": "Songti",
          "zh_CN": "宋体",
          "ru_RU": "Songti"
        },
        "value": "SimSun"
      },
      {
        "label": {
          "en_US": "Heiti",
          "zh_CN": "黑体",
          "ru_RU": "Heiti"
        },
        "value": "SimHei"
      },
      {
        "label": {
          "en_US": "Kaiti",
          "zh_CN": "楷体",
          "ru_RU": "Kaiti"
        },
        "value": "KaiTi"
      },
      {
        "label": {
          "en_US": "Kaiti GB2312",
          "zh_CN": "楷体_GB2312",
          "ru_RU": "Kaiti GB2312"
        },
        "value": "KaiTi_GB2312"
      },
      {
        "label": {
          "en_US": "Fangsong",
          "zh_CN": "仿宋",
          "ru_RU": "Fangsong"
        },
        "value": "FangSong"
      },
      {
        "label": {
          "en_US": "Fangsong GB2312",
          "zh_CN": "仿宋_GB2312",
          "ru_RU": "Fangsong GB2312"
        },
        "value": "FangSong_GB2312"
      },
      {
        "label": {
          "en_US": "STSong",
          "zh_CN": "华文宋体",
          "ru_RU": "STSong"
        },
        "value": "STSong"
      },
      {
        "label": {
          "en_US": "STFangsong",
          "zh_CN": "华文仿宋",
          "ru_RU": "STFangsong"
        },
        "value": "STFangsong"
      },
      {
        "label": {
          "en_US": "FZ Fangsong Simplified",
          "zh_CN": "方正仿宋简体",
          "ru_RU": "FZ Fangsong Simplified"
        },
        "value": "FZFangSong-Z02S"
      },
      {
        "label": {
          "en_US": "FZ Xiaobiao Song",
          "zh_CN": "方正小标宋",
          "ru_RU": "FZ Xiaobiao Song"
        },
        "value": "FZXiaoBiaoSong-B05S"
      },
      {
        "label": {
          "en_US": "Microsoft Yahei",
          "zh_CN": "微软雅黑",
          "ru_RU": "Microsoft Yahei"
        },
        "value": "Microsoft Yahei"
      },
      {
        "label": "Arial",
        "value": "Arial"
      },
      {
        "label": "Times New Roman",
        "value": "Times New Roman"
      },
      {
        "label": "Verdana",
        "value": "Verdana"
      },
      {
        "label": "Helvetica",
        "value": "Helvetica"
      },
      {
        "label": "Calibri",
        "value": "Calibri"
      },
      {
        "label": "Cambria",
        "value": "Cambria"
      },
      {
        "label": "Tahoma",
        "value": "Tahoma"
      },
      {
        "label": "Georgia",
        "value": "Georgia"
      },
      {
        "label": "Comic Sans MS",
        "value": "Comic Sans MS"
      },
      {
        "label": "Impact",
        "value": "Impact"
      }
    ],
    "colors": [
      "#FFF",
      "#000",
      "#4A5366",
      "#3B74EC",
      "#45A2EF",
      "#529867",
      "#CD4A3F",
      "#EA8D40",
      "#EEC543",
      "#8E45D0",
      "#F2F2F2",
      "#7F7F7F",
      "#F4F5F7",
      "#CBDCFC",
      "#E8F6FE",
      "#EDFAF2",
      "#FCEAE9",
      "#FDF3EC",
      "#FEF9E5",
      "#FAECFE",
      "#EEE",
      "#595959",
      "#C6CAD2",
      "#CEEBFD",
      "#CBDCFC",
      "#CBE9D7",
      "#F7CBC9",
      "#FADDC7",
      "#FDEEB5",
      "#EBCAFC",
      "#BFBFBF",
      "#3F3F3F",
      "#828B9D",
      "#A0BEFA",
      "#A7DCFC",
      "#A6D5B8",
      "#F2A19C",
      "#F5BC8C",
      "#FBE281",
      "#CB94F9",
      "#A5A5A5",
      "#262626",
      "#363B44",
      "#2452B2",
      "#3473A1",
      "#417A53",
      "#922B22",
      "#AD642A",
      "#9E8329",
      "#57297D",
      "#939393",
      "#0D0D0D",
      "#25272E",
      "#15316A",
      "#1C415A",
      "#284D34",
      "#511712",
      "#573213",
      "#635217",
      "#36194E"
    ],
    "lineHeights": [
      {
        "label": {
          "en_US": "Single",
          "zh_CN": "单倍行距",
          "ru_RU": "Одинарный"
        },
        "value": 1
      },
      {
        "label": {
          "en_US": "1.5 Line Spacing",
          "zh_CN": "1.5 倍行距",
          "ru_RU": "1.5 Межстрочных интервала"
        },
        "value": 1.5,
        "default": true
      },
      {
        "label": {
          "en_US": "Double",
          "zh_CN": "2 倍行距",
          "ru_RU": "Двойной"
        },
        "value": 2
      },
      {
        "label": {
          "en_US": "2.5 Line Spacing",
          "zh_CN": "2.5 倍行距",
          "ru_RU": "2.5 Межстрочных интервала"
        },
        "value": 2.5
      },
      {
        "label": {
          "en_US": "Triple",
          "zh_CN": "3 倍行距",
          "ru_RU": "Тройной"
        },
        "value": 3
      }
    ],
    "symbols": [
      {
        "label": {
          "en_US": "Plain Text",
          "zh_CN": "普通文本",
          "ru_RU": "Простой Текст"
        },
        "items": "‹›«»‘’“”‚„¡¿‥…‡‰‱‼⁈⁉⁇©®™§¶⁋"
      },
      {
        "label": {
          "en_US": "Currency Symbols",
          "zh_CN": "货币符号",
          "ru_RU": "Символы Валют"
        },
        "items": "$€¥£¢₠₡₢₣₤¤₿₥₦₧₨₩₪₫₭₮₯₰₱₲₳₴₵₶₷₸₹₺₻₼₽"
      },
      {
        "label": {
          "en_US": "Mathematical Symbols",
          "zh_CN": "数学符号",
          "ru_RU": "Математические Символы"
        },
        "items": "<>≤≥–—¯‾°−±÷⁄×ƒ∫∑∞√∼≅≈≠≡∈∉∋∏∧∨¬∩∪∂∀∃∅∇∗∝∠¼½¾"
      },
      {
        "label": {
          "en_US": "Arrows",
          "zh_CN": "箭头",
          "ru_RU": "Стрелки"
        },
        "items": "←→↑↓⇐⇒⇑⇓⇠⇢⇡⇣⇤⇥⤒⤓↨"
      },
      {
        "label": {
          "en_US": "Latin Script",
          "zh_CN": "拉丁语",
          "ru_RU": "Латинская письменность"
        },
        "items": "ĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽžſ"
      }
    ],
    "emojis": [
      {
        "label": {
          "en_US": "Emotions & People",
          "zh_CN": "表情与角色",
          "ru_RU": "Эмоции & Люди"
        },
        "items": "😀 😃 😄 😁 😆 😅 🤣 😂 🙂 🙃 🫠 😉 😊 😇 🥰 😍 🤩 😘 😗 ☺️ 😚 😙 🥲 😋 😛 😜 🤪 😝 🤑 🤗 🤭 🫢 🫣 🤫 🤔 🫡 🤐 🤨 😐 😑 😶 🫥 😶‍🌫️ 😏 😒 🙄 😬 😮‍💨 🤥 😌 😔 😪 🤤 😴 😷 🤒 🤕 🤢 🤮 🤧 🥵 🥶 🥴 😵 😵‍💫 🤯 🤠 🥳 🥸 😎 🤓 🧐 😕 🫤 😟 🙁 ☹️ 😮 😯 😲 😳 🥺 🥹 😦 😧 😨 😰 😥 😢 😭 😱 😖 😣 😞 😓 😩 😫 🥱 😤 😡 😠 🤬 😈 👿 💀 ☠️ 💩 🤡 👹 👺 👻 👽 👾 🤖 👋 🤚 🖐️ ✋ 🖖 🫱 🫲 🫳 🫴 👌 🤌 🤏 ✌️ 🤞 🫰 🤟 🤘 🤙 👈 👉 👆 🖕 👇 ☝️ 🫵 👍 👎 ✊ 👊 🤛 🤜 👏 🙌 🫶 👐 🤲 🤝 🙏 ✍️ 💅 🤳 💪 🦾 🦿 🦵 🦶 👂 🦻"
      },
      {
        "label": {
          "en_US": "Animals & Nature",
          "zh_CN": "动物与自然",
          "ru_RU": "Животные & Природа"
        },
        "items": "🐵 🐒 🦍 🦧 🐶 🐕 🦮 🐕‍🦺 🐩 🐺 🦊 🦝 🐱 🐈 🐈‍⬛ 🦁 🐯 🐅 🐆 🐴 🐎 🦄 🦓 🦌 🦬 🐮 🐂 🐃 🐄 🐷 🐖 🐗 🐽 🐏 🐑 🐐 🐪 🐫 🦙 🦒 🐘 🦣 🦏 🦛 🐭 🐁 🐀 🐹 🐰 🐇 🐿️ 🦫 🦔 🦇 🐻 🐻‍❄️ 🐨 🐼 🦥 🦦 🦨 🦘 🦡 🐾 🦃 🐔 🐓 🐣 🐤 🐥 🐦 🐧 🕊️ 🦅 🦆 🦢 🦉 🦤 🪶 🦩 🦚 🦜 🐸 🐊 🐢 🦎 🐍 🐲 🐉 🦕 🦖 🐳 🐋 🐬 🦭 🐟 🐠 🐡 🦈 🐙 🐚 🪸 🐌 🦋 🐛 🐜 🐝 🪲 🐞 🦗 🪳 🕷️ 🕸️ 🦂 🦟 🪰 🪱 🦠 💐 🌸 💮 🪷 🏵️ 🌹 🥀 🌺 🌻 🌼 🌷 🌱 🪴 🌲 🌳 🌴 🌵 🌾 🌿 ☘️ 🍀 🍁 🍂 🍃 🪹 🪺"
      },
      {
        "label": {
          "en_US": "Food & Drink",
          "zh_CN": "食物与食品",
          "ru_RU": "Еда & Напитки"
        },
        "items": "🥬 🥦 🧄 🧅 🍄 🥜 🫘 🌰 🍞 🥐 🥖 🫓 🥨 🥯 🥞 🧇 🧀 🍖 🍗 🥩 🥓 🍔 🍟 🍕 🌭 🥪 🌮 🌯 🫔 🥙 🧆 🥚 🍳 🥘 🍲 🫕 🥣 🥗 🍿 🧈 🧂 🥫 🍱 🍘 🍙 🍚 🍛 🍜 🍝 🍠 🍢 🍣 🍤 🍥 🥮 🍡 🥟 🥠 🥡 🦀 🦞 🦐 🦑 🦪 🍦 🍧 🍨 🍩 🍪 🎂 🍰 🧁 🥧 🍫 🍬 🍭 🍮 🍯 🍼 🥛 ☕ 🫖 🍵 🍶 🍾 🍷 🍸 🍹 🍺 🍻 🥂 🥃 🫗 🥤 🧋 🧃 🧉 🧊 🥢 🍽️ 🍴 🥄 🔪 🫙 🏺"
      },
      {
        "label": {
          "en_US": "Activities",
          "zh_CN": "活动",
          "ru_RU": "Активность"
        },
        "items": "🎗️ 🎟️ 🎫 🎖️ 🏆 🏅 🥇 🥈 🥉 ⚽ ⚾ 🥎 🏀 🏐 🏈 🏉 🎾 🥏 🎳 🏏 🏑 🏒 🥍 🏓 🏸 🥊 🥋 🥅 ⛳ ⛸️ 🎣 🤿 🎽 🎿 🛷 🥌 🎯 🪀 🪁 🎱 🔮 🪄 🧿 🪬 🎮 🕹️ 🎰 🎲 🧩 🧸 🪅 🪩 🪆 ♠️ ♥️ ♦️ ♣️ ♟️ 🃏 🀄 🎴 🎭 🖼️ 🎨 🧵 🪡 🧶 🪢"
      },
      {
        "label": {
          "en_US": "Travel & Places",
          "zh_CN": "旅行与景点",
          "ru_RU": "Путешествия & Места"
        },
        "items": "🚈 🚉 🚊 🚝 🚞 🚋 🚌 🚍 🚎 🚐 🚑 🚒 🚓 🚔 🚕 🚖 🚗 🚘 🚙 🛻 🚚 🚛 🚜 🏎️ 🏍️ 🛵 🦽 🦼 🛺 🚲 🛴 🛹 🛼 🚏 🛣️ 🛤️ 🛢️ ⛽ 🛞 🚨 🚥 🚦 🛑 🚧 ⚓ 🛟 ⛵ 🛶 🚤 🛳️ ⛴️ 🛥️ 🚢 ✈️ 🛩️ 🛫 🛬 🪂 💺 🚁 🚟 🚠 🚡 🛰️ 🚀 🛸 🛎️ 🧳 ⌛ ⏳ ⌚ ⏰ ⏱️ ⏲️ 🕰️ 🕛 🕧 🕐 🕜 🕑 🕝 🕒 🕞 🕓 🕟 🕔 🕠 🕕 🕡 🕖 🕢 🕗 🕣 🕘 🕤 🕙 🕥 🕚 🕦 🌑 🌒 🌓 🌔 🌕 🌖 🌗 🌘 🌙 🌚 🌛 🌜 🌡️ ☀️ 🌝 🌞 🪐 ⭐ 🌟 🌠 🌌 ☁️ ⛅ ⛈️ 🌤️ 🌥️ 🌦️ 🌧️ 🌨️ 🌩️ 🌪️ 🌫️ 🌬️ 🌀 🌈 🌂 ☂️ ☔ ⛱️ ⚡ ❄️ ☃️ ⛄ ☄️ 🔥 💧 🌊"
      },
      {
        "label": {
          "en_US": "Objects",
          "zh_CN": "物品",
          "ru_RU": "Объекты"
        },
        "items": "📃 📜 📄 📰 🗞️ 📑 🔖 🏷️ 💰 🪙 💴 💵 💶 💷 💸 💳 🧾 💹 ✉️ 📧 📨 📩 📤 📥 📦 📫 📪 📬 📭 📮 🗳️ ✏️ ✒️ 🖋️ 🖊️ 🖌️ 🖍️ 📝 💼 📁 📂 🗂️ 📅 📆 🗒️ 🗓️ 📇 📈 📉 📊 📋 📌 📍 📎 🖇️ 📏 📐 ✂️ 🗃️ 🗄️ 🗑️ 🔒 🔓 🔏 🔐 🔑 🗝️ 🔨 🪓 ⛏️ ⚒️ 🛠️ 🗡️ ⚔️ 🔫 🪃 🏹 🛡️ 🪚 🔧 🪛 🔩 ⚙️ 🗜️ ⚖️ 🦯 🔗 ⛓️ 🪝 🧰 🧲 🪜 ⚗️ 🧪 🧫 🧬 🔬 🔭 📡 💉 🩸 💊 🩹 🩼 🩺 🩻 🚪 🛗 🪞 🪟 🛏️ 🛋️ 🪑 🚽 🪠 🚿 🛁 🪤 🪒 🧴 🧷 🧹 🧺 🧻 🪣 🧼 🫧 🪥 🧽 🧯 🛒 🚬 ⚰️ 🪦 ⚱️ 🗿 🪧 🪪"
      },
      {
        "label": {
          "en_US": "Symbols",
          "zh_CN": "符号",
          "ru_RU": "Символы"
        },
        "items": "➰ ➿ 〽️ ✳️ ✴️ ❇️ ©️ ®️ ™️ #️⃣ *️⃣ 0️⃣ 1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ 8️⃣ 9️⃣ 🔟 🔠 🔡 🔢 🔣 🔤 🅰️ 🆎 🅱️ 🆑 🆒 🆓 ℹ️ 🆔 Ⓜ️ 🆕 🆖 🅾️ 🆗 🅿️ 🆘 🆙 🆚 🈁 🈂️ 🔴 🟠 🟡 🟢 🔵 🟣 🟤 ⚫ ⚪ 🟥 🟧 🟨 🟩 🟦 🟪 🟫 ⬛ ⬜ ◼️ ◻️ ◾ ◽ ▪️ ▫️ 🔶 🔷 🔸 🔹 🔺 🔻 💠 🔘 🔳 🔲"
      },
      {
        "label": {
          "en_US": "Flags",
          "zh_CN": "旗帜",
          "ru_RU": "Флаги"
        },
        "items": "🏁 🇨🇳 🎌 🇩🇪 🇪🇸 🇦🇨 🇦🇩 🇦🇪 🇦🇫 🇦🇬 🇦🇮 🇦🇱 🇦🇲 🇦🇴 🇦🇶 🇦🇷 🇦🇸 🇦🇹 🇦🇺 🇦🇼 🇦🇽 🇦🇿 🇧🇦 🇧🇧 🇧🇩 🇧🇪 🇧🇫 🇧🇬 🇧🇭 🇧🇮 🇧🇯 🇧🇱 🇧🇲 🇧🇳 🇧🇴 🇧🇶 🇧🇷 🇧🇸 🇧🇹 🇧🇻 🇧🇼 🇧🇾 🇧🇿 🇨🇦 🇨🇨 🇨🇩 🇨🇫 🇨🇬 🇨🇭 🇨🇮 🇨🇰 🇨🇱 🇨🇲 🇨🇴 🇨🇵 🇨🇷 🇨🇺 🇨🇻 🇨🇼 🇨🇽 🇨🇾 🇨🇿 🇩🇬 🇩🇯 🇩🇰 🇩🇲 🇩🇴 🇩🇿 🇪🇦 🇪🇨 🇪🇪 🇪🇬 🇪🇭 🏴󠁧󠁢󠁥󠁮󠁧󠁿 🇪🇷 🇪🇹 🇪🇺 🇫🇮 🇫🇯 🇫🇰 🇫🇲 🇫🇴 🇬🇦 🇬🇩 🇬🇪 🇬🇫 🇬🇬 🇬🇭 🇬🇮 🇬🇱 🇬🇲 🇬🇳 🇬🇵 🇬🇶 🇬🇷 🇬🇸 🇬🇹 🇬🇺 🇬🇼 🇬🇾 🇭🇰 🇭🇲 🇭🇳 🇭🇷 🇭🇹 🇭🇺 🇮🇨 🇮🇩 🇮🇪 🇮🇱 🇮🇲 🇮🇳 🇮🇴 🇮🇶 🇮🇷 🇮🇸 🇯🇪 🇯🇲 🇯🇴 🇰🇪 🇰🇬 🇰🇭 🇰🇮 🇰🇲 🇰🇳 🇰🇵 🇰🇼 🇰🇾 🇰🇿 🇱🇦 🇱🇧 🇱🇨 🇱🇮 🇱🇰 🇱🇷 🇱🇸 🇱🇹 🇱🇺 🇱🇻 🇱🇾 🇲🇦 🇲🇨 🇲🇩 🇲🇪 🇲🇫 🇲🇬 🇲🇭 🇲🇰 🇲🇱 🇲🇲 🇲🇳 🇲🇴 🇲🇵 🇲🇶 🇲🇷 🇲🇸 🇲🇹 🇲🇺 🇲🇻 🇲🇼 🇲🇽 🇲🇾 🇲🇿 🇳🇦 🇳🇨 🇳🇪 🇳🇫 🇳🇬 🇳🇮 🇳🇱 🇳🇴"
      }
    ],
    "pageSizes": [
      {
        "label": "A4",
        "width": 21,
        "height": 29.7,
        "default": true
      },
      {
        "label": "A3",
        "width": 29.7,
        "height": 42
      },
      {
        "label": "A5",
        "width": 14.8,
        "height": 21
      },
      {
        "label": "B5",
        "width": 17.6,
        "height": 25
      },
      {
        "label": {
          "en_US": "No. 5 Envelope",
          "zh_CN": "5号信封",
          "ru_RU": "Конверт №5"
        },
        "width": 10.9,
        "height": 12.9
      },
      {
        "label": {
          "en_US": "No. 6 Envelope",
          "zh_CN": "6号信封",
          "ru_RU": "Конверт №6"
        },
        "width": 11.9,
        "height": 22.9
      },
      {
        "label": {
          "en_US": "No. 7 Envelope",
          "zh_CN": "7号信封",
          "ru_RU": "Конверт №7"
        },
        "width": 16.1,
        "height": 22.8
      },
      {
        "label": {
          "en_US": "No. 9 Envelope",
          "zh_CN": "9号信封",
          "ru_RU": "Конверт №9"
        },
        "width": 22.8,
        "height": 32.3
      },
      {
        "label": {
          "en_US": "Legal Paper",
          "zh_CN": "法律用纸",
          "ru_RU": "Юридическая бумага"
        },
        "width": 21.5,
        "height": 33.5
      },
      {
        "label": {
          "en_US": "Letter Paper",
          "zh_CN": "信纸",
          "ru_RU": "Бумага для писем"
        },
        "width": 21.5,
        "height": 27.9
      }
    ]
  },
  "toolbar": {
    "defaultMode": "ribbon",
    "enableSourceEditor": true,
    "menus": [
      "base",
      "insert",
      "table",
      "tools",
      "page",
      "export"
    ],
    "disableMenuItems": [],
    "importWord": {
      "enabled": true,
      "options": {},
      "useCustomMethod": false
    }
  },
  "page": {
    "defaultMargin": {
      "left": 3.18,
      "right": 3.18,
      "top": 2.54,
      "bottom": 2.54
    },
    "defaultOrientation": "portrait",
    "defaultBackground": "#fff",
    "showBreakMarks": true,
    "watermark": {
      "type": "compact",
      "alpha": 0.2,
      "fontColor": "#000",
      "fontFamily": "SimSun",
      "fontSize": 16,
      "fontWeight": "normal",
      "text": ""
    }
  },
  "document": {
    "title": "",
    "content": "",
    "placeholder": {
      "en_US": "Please enter the document content...",
      "zh_CN": "请输入文档内容...",
      "ru_RU": "Пожалуйста, введите содержимое документа..."
    },
    "enableSpellcheck": true,
    "enableMarkdown": true,
    "enableBubbleMenu": true,
    "enableBlockMenu": true,
    "readOnly": false,
    "autofocus": true,
    "characterLimit": 0,
    "typographyRules": {},
    "editorProps": {},
    "parseOptions": {
      "preserveWhitespace": "full"
    },
    "autoSave": {
      "enabled": true,
      "interval": 300000
    }
  },
  "assistant": {
    "enabled": true,
    "maxlength": 100,
    "commands": [
      {
        "label": {
          "en_US": "Continuation",
          "zh_CN": "续写",
          "ru_RU": "Продолжение"
        },
        "value": {
          "en_US": "Continuation",
          "zh_CN": "续写",
          "ru_RU": "Продолжение"
        }
      },
      {
        "label": {
          "en_US": "Rewrite",
          "zh_CN": "重写",
          "ru_RU": "Переписать"
        },
        "value": {
          "en_US": "Rewrite",
          "zh_CN": "重写",
          "ru_RU": "Переписать"
        }
      },
      {
        "label": {
          "en_US": "Abbreviation",
          "zh_CN": "缩写",
          "ru_RU": "Аббревиатура"
        },
        "value": {
          "en_US": "Abbreviation",
          "zh_CN": "缩写",
          "ru_RU": "Аббревиатура"
        }
      },
      {
        "label": {
          "en_US": "Expansion",
          "zh_CN": "扩写",
          "ru_RU": "Расширение"
        },
        "value": {
          "en_US": "Expansion",
          "zh_CN": "扩写",
          "ru_RU": "Расширение"
        }
      },
      {
        "label": {
          "en_US": "Polish",
          "zh_CN": "润色",
          "ru_RU": "Полировать"
        },
        "value": {
          "en_US": "Polish",
          "zh_CN": "润色",
          "ru_RU": "Полировать"
        }
      },
      {
        "label": {
          "en_US": "Proofread",
          "zh_CN": "校阅",
          "ru_RU": "Корректура"
        },
        "value": {
          "en_US": "Proofread",
          "zh_CN": "校阅",
          "ru_RU": "Корректура"
        }
      },
      {
        "label": {
          "en_US": "Translate",
          "zh_CN": "翻译",
          "ru_RU": "Перевести"
        },
        "value": {
          "en_US": "Translate to chinese",
          "zh_CN": "翻译成英文",
          "ru_RU": "Перевести на китайский"
        },
        "autoSend": false
      }
    ]
  },
  "shareUrl": "https://demo.umodoc.com/editor?lang=en-US",
  "templates": [],
  "cdnUrl": "https://cdn.umodoc.com",
  "diagrams": {
    "domain": "https://embed.diagrams.net",
    "params": {}
  },
  "file": {
    "allowedMimeTypes": [],
    "maxSize": 104857600,
    "preview": [
      {
        "extensions": [
          "pdf"
        ],
        "url": "{url}"
      },
      {
        "extensions": [
          "doc",
          "docx",
          "xls",
          "xlsx",
          "ppt",
          "pptx"
        ],
        "url": "https://view.officeapps.live.com/op/embed.aspx?src={{url}}&amp;wdStartOn=1&amp;wdPrint=0&amp;wdEmbedCode=0"
      }
    ]
  },
  "user": {},
  "extensions": [],
  "translations": {
    "en_US": {},
    // "zh_CN": {},
    // "ru_RU": {}
  }
}) 
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 py-3 px-4 flex items-center justify-between">
      <div class="flex items-center">
        <button @click="goBack" class="mr-4 text-gray-500 hover:text-gray-700">
          <ArrowLeftIcon class="w-5 h-5" />
        </button>
        <h1 class="text-xl font-semibold text-gray-800">{{ document?.name }}</h1>
        <span v-if="saveMessage" class="ml-4 text-sm text-green-600">{{ saveMessage }}</span>
      </div>
      <div class="flex items-center space-x-2">
        <button 
          @click="previewDocument" 
          class="btn btn-secondary flex items-center"
          title="Preview"
        >
          <EyeIcon class="w-5 h-5 mr-1" />
          Preview
        </button>
        <button 
          @click="duplicateDocument" 
          class="btn btn-secondary flex items-center"
          title="Duplicate"
        >
          <DocumentDuplicateIcon class="w-5 h-5 mr-1" />
          Duplicate
        </button>
        <button 
          @click="saveDocument" 
          class="btn btn-primary"
          :disabled="isSaving"
        >
          {{ isSaving ? 'Saving...' : 'Save' }}
        </button>
      </div>
    </header>
    
    <!-- Editor -->
    <umo-editor v-bind="umoOptions" />

  </div>
</template>