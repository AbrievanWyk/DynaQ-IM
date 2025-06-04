'use strict';

const QueryBuilder = (function () {
   function buildCamlQuery(itemId, fields) {
       return `<View>
           <Query>
               <Where>
                   <Eq>
                       <FieldRef Name='ID'/>
                       <Value Type='Counter'>${itemId}</Value>
                   </Eq>
               </Where>
           </Query>
           <ViewFields>
               ${fields.map(field => `<FieldRef Name='${field}'/>`).join('')}
           </ViewFields>
       </View>`;
   }

   function buildListItemQuery(itemId, fields) {
      const camlQuery = new SP.CamlQuery();
      camlQuery.set_viewXml(buildCamlQuery(itemId, fields));
      return camlQuery;
   }

   function buildComplaintTypeQuery(complaintType) {
       return buildEqualsQuery('Complaint_x0020_Type', complaintType, 'Text');
   }

   function buildProductCategoryQuery(productCategory) {
       return buildEqualsQuery('Product_x0020_Category', productCategory, 'Text');
   }

   // Generic helper for simple equals queries
   function buildEqualsQuery(fieldName, value, type = 'Text') {
       const query = `<View>
           <Query>
               <Where>
                   <Eq>
                       <FieldRef Name='${fieldName}'/>
                       <Value Type='${type}'>${value}</Value>
                   </Eq>
               </Where>
           </Query>
       </View>`;
       const camlQuery = new SP.CamlQuery();
       camlQuery.set_viewXml(query);
       return camlQuery;
   }

   return {
       buildListItemQuery,
       buildComplaintTypeQuery,
       buildProductCategoryQuery,
       buildEqualsQuery
   };
})();

window.QueryBuilder = QueryBuilder;
