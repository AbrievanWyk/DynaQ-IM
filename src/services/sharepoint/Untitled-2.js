document.addEventListener("DOMContentLoaded", function () {
    const pageHeading = document.querySelector(".page-heading");
    const nextContainer = pageHeading?.nextElementSibling;

    if (pageHeading && nextContainer && nextContainer.classList.contains("container")) {
        // Create the wrapper div
        const wrapper = document.createElement("div");
        wrapper.classList.add("DPSAparentDiv");

        // Wrap the elements
        pageHeading.before(wrapper);
        wrapper.appendChild(pageHeading);
        wrapper.appendChild(nextContainer);
    }

    var section = document.querySelector('.col-lg-4');
    if (section) {
        section.style.display = 'none';
    }

});

$(document).ready(function () {
    const $input = $('#mmt_personelnumber');
    // const $submitBtn = $('#ContentContainer_MainContent_MainContent_ContentBottom_SubmitButton');

    // Inject error div if not present
    if ($('#personnelNumberError').length === 0) {
        $input.closest('.control').after(`
      <div id="personnelNumberError" class="text-danger mt-1" style="font-size: 12px; display: none;">
        Personnel Number must be exactly 8 digits.
      </div>
    `);
    }

    const $error = $('#personnelNumberError');

    function validatePersonnelNumber() {
        let value = $input.val().replace(/\D/g, '');

        // Enforce max 8 digits
        if (value.length > 8) {
            value = value.substring(0, 8);
        }

        $input.val(value);

        const isValid = value.length === 8;

        // Show/hide error and enable/disable submit
        $error.toggle(!isValid);
        // $submitBtn.prop('disabled', !isValid);
    }

    // Bind validation to input and blur
    $input.on('input blur', validatePersonnelNumber);

    // Initial check in case field is prefilled
    validatePersonnelNumber();
});

// $(document).ready(function () {
//     var userId = "{{user.id}}";
//     $.ajax({
//         url: "/_api/contacts(" + userId + ")?$select=_mmt_entity_value,mmt_region,mmt_dmsroleapproved",
//         type: "GET",
//         headers: {
//             "Accept": "application/json",
//             "Content-Type": "application/json"
//         },
//         success: function (data) {
//             if (data && data.mmt_dmsroleapproved) {
//                 if (data.mmt_dmsroleapproved == true) {
//                     //Disable Province and Department Fields if the user is approved

//                     $("#mmt_region").prop("disabled", true);
//                     $("#mmt_employeeentity").prop("disabled", true);
//                 }
//             }


//         },
//         error: function (error) {
//             console.error("getEntityValueByLoggedInUserId");
//             console.log(error);
//         }
//     });
// });

$(document).ready(function () {

    // 1. Hide the original control
    $('#mmt_entity_label').closest('.table-info').next('.control').hide();

    // 2. Extract the current selected entity ID and name from the hidden control
    const selectedEntityId = $('#mmt_entity').val();
    const selectedEntityName = $('#mmt_entity_name').val();
    const currentRegion = $('#mmt_region').val();

    // If region is populated, hide the region field and show its value in a .mmt-control div
    if (currentRegion) {
        // Hide the region field's control
    $('#mmt_region_label').closest('.table-info').next('.control').hide();
      //   $('#mmt_region').closest('.control').hide();
        // Get the display value (text) of the selected region option
        const regionDisplay = $('#mmt_region option:selected').text();
        // Insert a .mmt-control div after the region label
        $('<div class="mmt-control"><br/>' +
            '<span id="mmt_region_span">' + regionDisplay + '</span>' +
            '</div>').insertAfter($('#mmt_region_label').closest('.table-info'));
    }

    // 3. If both mmt_entity_name and mmt_region are populated, render a span with the value
    if (selectedEntityName && currentRegion) {
        $('<div class="mmt-control"><br/>' +
            '<span id="mmt_employeeentity_span">' + selectedEntityName + '</span>' +
            '</div>').insertAfter($('#mmt_entity_label').closest('.table-info'));
    } else {
        // 4. Otherwise, insert your custom control after the label and call APIs
        $('<div class="custom-control">' +
            '<select id="mmt_employeeentity" class="form-control form-select picklist" disabled>' +
            '<option value="">Select</option>' +
            '</select>' +
            '</div>').insertAfter($('#mmt_entity_label').closest('.table-info'));

        // 5. Hold all entities returned from the API
        let allEntities = [];

        // 6. Fetch the data and populate based on region
        $.ajax({
            type: "GET",
            url: "/_api/mmt_entities?$select=mmt_entityid,mmt_name,mmt_region",
            headers: {
                "Accept": "application/json"
            },
            success: function (data) {
                // Sort alphabetically by mmt_name (case-insensitive)
                data.value.sort((a, b) => a.mmt_name.localeCompare(b.mmt_name, undefined, { sensitivity: 'base' }));
                allEntities = data.value;
                $('#mmt_employeeentity').prop('disabled', false);
                // Populate immediately based on selected region
                updateEntityDropdown(currentRegion);
            },
            error: function (xhr) {
                console.error("Error fetching entity options:", xhr);
            }
        });

        // 7. Populate employee dropdown, optionally filtering by region
        function updateEntityDropdown(regionFilter = 0) {
            const $dropdown = $('#mmt_employeeentity');
            $dropdown.empty().append('<option value="">Select</option>');
            allEntities.forEach(entity => {
                if (entity.mmt_region === parseInt(regionFilter)) {
                    const $option = $('<option>', {
                        value: entity.mmt_entityid,
                        text: entity.mmt_name,
                        'data-region': entity.mmt_region
                    });
                    // Preselect the entity if it matches the original hidden value
                    if (entity.mmt_entityid === selectedEntityId) {
                        $option.attr('selected', 'selected');
                    }
                    $dropdown.append($option);
                }
            });
        }

        // 8. Handle cascading behavior on region change
        $('#mmt_region').on('change', function () {
            const selectedRegion = $(this).val();
            if (selectedRegion)
                updateEntityDropdown(parseInt(selectedRegion));
        });

        // 9. Sync selected entity to hidden fields on change
        $('#mmt_employeeentity').on('change', function () {
            const selectedOption = $(this).find('option:selected');
            const selectedEntityId = selectedOption.val();
            const selectedOEntityName = selectedOption.text();
            // Update the hidden lookup fields
            $("#mmt_entity_name").attr("value", selectedOEntityName);
            $("#mmt_entity").attr("value", selectedEntityId);
            $("#mmt_entity_entityname").attr("value", "mmt_entity");
        });
    }
});