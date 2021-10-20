<template>

    <div class="container w-full my-4">
        <h5>Laboratory Setup</h5>
        <ul class="grid grid-cols-12 gap-4 my-2.5">
            <item-setting 
                v-for="setting in configs"
                :key="setting.path"
                :title="setting.title"
                :path="setting.path"
                icon="cog"
                />
        </ul>
        <hr>
    </div>

</template>

<script>
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import ItemSetting from '../components/AdminBreadCrumb.vue';
export default defineComponent({
  name: "admin",
  components: {
      ItemSetting
  },
  setup() {
      const configs = ref([
          { title: "Country, Provinces, Districts", path: "/admin/location-conf",},
          { title: "Laboratory, Departments", path: "/admin/laboratory-conf",},
          { title: "Users, Groups", path: "/admin/users-conf",},
          { title: "Suppliers", path: "/admin/suppliers-conf",},
          { title: "Instruments, Methods", path: "/admin/instruments-conf",},
          { title: "Sample Types, Containers", path: "/admin/sampletypes-conf",},
          { title: "Tests, Categories, Profiles, QC", path: "/admin/analyses-conf",},
          { title: "WorkSheet Templates", path: "/admin/worksheets-conf",},
          { title: "Email, SMS", path: "/admin/publication-conf",},
      ])
    return { configs };
  },
});
</script>