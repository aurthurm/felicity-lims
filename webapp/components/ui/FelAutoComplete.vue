
<template>
<div style="position:relative" v-bind:class="{'open':openSuggestion}">
    {{ message }}
    <input class="form-control" type="text" v-model="query"
        @keydown.enter = 'enter'
        @keydown.down = 'down'
        @keydown.up = 'up'
        @input = 'change'
    />
    <ul class="dropdown-menu" style="width:100%">
        <li v-for="suggestion in suggestions"
            v-bind:class="{'active': isActive($index)}"
            @click="suggestionClick($index)"
        >
            <a>{{ suggestion }}</a>
        </li>
    </ul>
</div>
</template>


<script lang="ts">
import { defineComponent, ref, toRefs, computed } from 'vue';

export default defineComponent({
  name: "auto-complete",    
  props: {
        suggestions: {
            type: Array,
            required: true
        },

        selection: {
            type: String,
            required: true,
            twoWay: true
        }
  },
  emits: ['update:selection'],
  setup(props, { emit }) {

        const { suggestions } = toRefs(props);

        const query = computed({
            get: () => props.selection,
            set: (val) => emit('update:selection', val),
        });

        let open = ref(false);
        let current = ref(0);

        const matches = computed((suggestions, selection) => suggestions?.filter((str) => str.indexOf(selection) >= 0))
        const openSuggestion = computed((selection, matches, open) =>  (selection !== "" && matches?.length != 0 && open === true))

        function enter(): void {
            query = matches[current];
            open = false;
        }

        function up(): void {
            if(current > 0) current--;
        }

        function down(): void {
            if(current < matches?.length - 1)  current++;
        }

        function isActive(index) {
            return index === current;
        }

        function change(): void {
            if (open == false) {
                open = true;
                current = 0;
            }
        }

        function suggestionClick(index) {
            query = matches[index];
            open = false;
        }

        return {
            matches,
            openSuggestion,
            open,
            current,
            enter,
            up,
            down,
            isActive,
            change,
            suggestionClick,
            query
        };
  },
});
</script>
