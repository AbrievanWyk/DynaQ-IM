

function ViewAuditComplaintData() {
   SPListOperations.populateScopeList("Audit Categories");
   SPListOperations.populateScopeList("Audit Areas");
   SPListOperations.populateScopeList("Audit Area Standards");
   SPListOperations.populateScopeList("Audit Parties");
   SPListOperations.populateScopeList("Audit Finding Classifications");
   SPListOperations.populateScopeList("Audit Finding Areas");
}