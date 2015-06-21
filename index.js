var db = new PouchDB('ahsanTeaShop');

$(function () {
    PopulateTables();
    PopulateDropDown();
});

function PopulateTables() {
    db.allDocs({
        include_docs: true,
        attachments: true,
        startkey: 'cat',
        endkey: 'cat\uffff'
    }).then(function (result) {
        console.log(result.rows);
        $.each(result.rows, function (i, row) {
            var serialNumber = i + 1;
            var myRow = '<tr><td scope="row">' + serialNumber + '</td><td>' + row.doc.catId + '</td><td>' + row.doc.name + '</td><td><a onclick="EditCategory(this)" data-id="' + row.doc._id + '" href="javascript:void(0)">Edit</a> |<a onclick="DeleteCategory(this)" data-id="' + row.doc._id + '" href="javascript:void(0)">Delete</a></td></tr>';
            $("#tblCategory tr:last").after(myRow);
        });
    }).catch(function (err) {
        console.log(err);
    });
    db.allDocs({
        include_docs: true,
        attachments: true,
        startkey: 'pro',
        endkey: 'pro\uffff'
    }).then(function (result) {
        console.log(result);
        $.each(result.rows, function (i, row) {
            var serialNumber = i + 1;
            var myRow = '<tr><td scope="row">' + serialNumber + '</td><td>' + row.doc.proId + '</td><td>' + row.doc.name + '</td><td>' + row.doc.unitePrice + '</td><td>' + row.doc.catId + '</td><td><a onclick="EditProduct(this)" data-id="' + row.doc._id + '" href="javascript:void(0)">Edit</a> |<a onclick="DeleteProduct(this)" data-id="' + row.doc._id + '" href="javascript:void(0)">Delete</a></td></tr>';
            $("#tblProduct tr:last").after(myRow);
        });
    }).catch(function (err) {
        console.log(err);
    });
}

function PopulateDropDown() {
    db.allDocs({
        include_docs: true,
        attachments: true,
        startkey: 'cat',
        endkey: 'cat\uffff'
    }).then(function (result) {
        console.log(result.rows);
        $.each(result.rows, function (i, row) {
            var selectOption = '<option value="' + row.doc.catId + '">' + row.doc.name + '</option>'
            $("#productCatId option:last").after(selectOption);
            $("#editProductCatId option:last").after(selectOption);
        });
    }).catch(function (err) {
        console.log(err);
    });
}


$('#btnAddCategory').on('click', function (event) {
    event.preventDefault();
    var doc = {
        "_id": 'cat_' + $('#catName').val().toLowerCase(),
        "name": $('#catName').val(),
        "catId": $('#catId').val()
    };
    db.put(doc).then(function () {
        window.location.reload();
    });
});

function EditCategory(obj) {
    var id = obj.dataset.id;
    console.log(id);
    db.get(id).then(function (doc) {
        console.log(doc);
        $('#editCategoryModal #editCatkey').val(doc._id);
        $('#editCategoryModal #editCatName').val(doc.name);
        $('#editCategoryModal #editCatId').val(doc.catId);
        $('#editCategoryModal').modal('show');
    });
}

function DeleteCategory(obj) {
    var id = obj.dataset.id;
    db.get(id).then(function (doc) {
        return db.remove(doc);
    }).then(function () {
        window.location.reload();
    });
}

$('#btnEditCategory').on('click', function (event) {
    event.preventDefault();
    db.get($('#editCategoryModal #editCatkey').val()).then(function (doc) {
        // update his age
        doc.name = $('#editCategoryModal #editCatName').val();
        doc.catId = $('#editCategoryModal #editCatId').val();
        // put him back
        return db.put(doc);
    }).then(function () {
        window.location.reload();
    });
});

$('#btnAddProduct').on('click', function (event) {
    event.preventDefault();
    var doc = {
        "_id": 'pro_' + $('#proName').val().toLowerCase(),
        "name": $('#proName').val(),
        "unitePrice": $('#unitePrice').val(),
        "proId": $('#proId').val(),
        "catId": $('#productCatId').val()
    };
    db.put(doc).then(function () {
        window.location.reload();
    });
});

function EditProduct(obj) {
    var id = obj.dataset.id;
    db.get(id).then(function (doc) {
        $('#editProductModal #productKey').val(doc._id);
        $('#editProductModal #editProId').val(doc.proId);
        $('#editProductModal #editProName').val(doc.name);
        $('#editProductModal #editUnitePrice').val(doc.unitePrice);
        $('#editProductModal #editProductCatId').val(doc.catId);
        $('#editProductModal').modal('show');
    });
}

$('#btnEditProduct').on('click', function (event) {
    event.preventDefault();
    db.get($('#editProductModal #productKey').val()).then(function (doc) {
        // update his age
        doc.name = $('#editProductModal #editProName').val();
        doc.unitePrice = $('#editProductModal #editUnitePrice').val();
        doc.proId = $('#editProductModal #editProId').val();
        doc.catId = $('#editProductModal #editProductCatId').val();
        // put him back
        return db.put(doc);
    }).then(function () {
        window.location.reload();
    });
});

function DeleteProduct(obj) {
    var id = obj.dataset.id;
    db.get(id).then(function (doc) {
        return db.remove(doc);
    }).then(function () {
        window.location.reload();
    });
}

$('#navProduct').on('click', function () {
    $('.category').hide();
    $('.product').show();
    $('#navProduct').addClass('active');
    $('#navCategory').removeClass('active');
});

$('#navCategory').on('click', function () {
    $('.product').hide();
    $('.category').show();
    $('#navCategory').addClass('active');
    $('#navProduct').removeClass('active');
});

function DestroyDatabase() {
    var db = new PouchDB('ahsanTeaShop');
    db.destroy().then(function () {
        console.log('deleted');
    }).catch(function (error) {
        console.log(error);
    });
}