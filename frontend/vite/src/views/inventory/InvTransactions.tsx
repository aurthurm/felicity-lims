import { defineComponent, computed, reactive, toRefs, ref, watch } from 'vue';

const InventoryTransactions = defineComponent({
  name: 'stock-transactions',
  setup(props, ctx) {
    return {};
  },
  render() {
    return <p>transactions here</p>;
  },
});

export { InventoryTransactions };
