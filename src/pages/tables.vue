<script setup>
import TablePaginate from '@/views/pages/tables/TablePaginate.vue';
import TablePaginateProps from '@/views/pages/tables/TablePaginateProps.vue';
//import DemoSimpleTableBasics from '@/views/pages/tables/DemoSimpleTableBasics.vue'
import fetchData from "@/services/fetchData";
import DemoSimpleTableDensity from '@/views/pages/tables/DemoSimpleTableDensity.vue';
import DemoSimpleTableFixedHeader from '@/views/pages/tables/DemoSimpleTableFixedHeader.vue';
import DemoSimpleTableHeight from '@/views/pages/tables/DemoSimpleTableHeight.vue';
import DemoSimpleTableTheme from '@/views/pages/tables/DemoSimpleTableTheme.vue';

 const {arrayData} = fetchData('api.json');//.then((lista) => {
//   this.data = lista;
// }).catch((error) => {
//   switch(error) {
//     case: 'NOT_FOUND': return this.$notification.error('No encontrado')
//     case: 'NOT_FOUND': return this.$notification.error('No encontrado')
//     case: 'NOT_FOUND': return this.$notification.error('No encontrado')
//     case: 'NOT_FOUND': return this.$notification.error('No encontrado')
//     case: 'NOT_FOUND': return this.$notification.error('No encontrado')
//     case: 'NOT_FOUND': return this.$notification.error('No encontrado')
//     case: 'NOT_FOUND': return this.$notification.error('No encontrado')
//     case: 'NOT_FOUND': return this.$notification.error('No encontrado')
//   }
// }).finally(() => {
//   this.loading = false;
// });

</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Table Paginate Props">
        <TablePaginateProps :dataRow="arrayData"/>
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard title="Table Paginate">
        <TablePaginate />
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard title="Theme">
        <VCardText>
          use <code>theme</code> prop to switch table to the dark theme.
        </VCardText>
        <DemoSimpleTableTheme />
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard title="Density">
        <VCardText>
          You can show a dense version of the table by using the <code>density</code> prop.
        </VCardText>
        <DemoSimpleTableDensity />
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard title="Height">
        <VCardText>
          You can set the height of the table by using the <code>height</code> prop.
        </VCardText>
        <DemoSimpleTableHeight />
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard title="Fixed Header">
        <VCardText>
          You can fix the header of table by using the <code>fixed-header</code> prop.
        </VCardText>
        <DemoSimpleTableFixedHeader />
      </VCard>
    </VCol>
  </VRow>
</template>
