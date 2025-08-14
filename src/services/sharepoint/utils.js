'use strict';

const SPUtils = (function () {
   function getItemTypeForListName(name) {
      //  return "SP.Data." + name.charAt(0).toUpperCase() + name.split(" ").join("").slice(1);
      return "SP.Data." + "IncidentsListItem";
   }

   async function getSPUserId(userName) {
      try {
         const context = new SP.ClientContext.get_current();
         const user = context.get_web().ensureUser(userName);
         context.load(user);

         await new Promise((resolve, reject) => {
            context.executeQueryAsync(
               () => resolve(),
               (sender, args) => reject(new Error(args.get_message()))
            );
         });

         return user.get_id();
      } catch (error) {
         console.error(`Error getting user ID for ${userName}:`, error);
         throw error;
      }
   }

   return {
      getItemTypeForListName,
      getSPUserId
   };
})();

window.SPUtils = SPUtils;
