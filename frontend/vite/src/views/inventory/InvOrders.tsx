import { defineComponent, computed, reactive, toRefs, ref, watch } from 'vue';

const InventoryOrders = defineComponent({
  name: 'stock-orders',
  setup(props, ctx) {
    return {};
  },
  render() {
    return <p>Orders here</p>;
  },
});

export { InventoryOrders };
