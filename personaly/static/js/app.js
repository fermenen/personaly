function deleteContact(contactId, contactName) {
        $("#contact_id").val(contactId);
        $("#contact_name").text(contactName);
        UIkit.modal(modal_delete_contact).show();
}

