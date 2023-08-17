let editImageFiles = [];
let editFormData = new FormData();
/**
 * 상품등록 유효성 검증
 */
$(document).on('click', '#editProductSubmitBtn', () => {
    if($.trim($("#productName").val())===""){
        $(".txt04").show();
        $("#errorMsg").text("상품명을 입력하셔야 합니다.");
        $("#productName").val('').focus();
        return false;
    }

    if($.trim($("#productSort").val())===""){
        $(".txt04").show();
        $("#errorMsg").text("상품분류를 선택해주세요.");
        $("#productSort").val('').focus();
        return false;
    }

    if($.trim($("#productPrice").val())===""){
        $(".txt04").show();
        $("#errorMsg").text("상품가격을 입력해주세요.");
        $("#productPrice").val('').focus();
        return false;
    }

    if($.trim($("#productInventory").val())===""){
        // 아이디를 입력하지 않은 경우 모달창 띄우기
        $(".txt04").show();
        $("#errorMsg").text("재고수량을 입력해주세요.");
        $("#productInventory").val('').focus();
        return false;
    }

    if($.trim($("#productPicture").val())==""){
        // 아이디를 입력하지 않은 경우 모달창 띄우기
        $(".txt04").show();
        $("#errorMsg").text("상품이미지를 등록해주세요.");
        $("#productPicture").val('').focus();
        return false;
    }

    // if($.trim($("#productDescription").val())==""){
    //     // 아이디를 입력하지 않은 경우 모달창 띄우기
    //     $(".txt04").show();
    //     $("#errorMsg").text("상품 상세정보를 입력해주세요.");
    //     $("#productDescription").val('').focus();
    //     return false;
    // }

    const isConfirmed = confirm("상품을 수정하시겠습니까?");
    if (!isConfirmed) {
        return false;
    }

    return editProductSubmitForm();
});

tinymce.init({
    selector: "#productDescription",
    plugins: "paste image",
    height: 500,
    width: 900,
    toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | image",
    paste_data_images: true,
    file_picker_types: 'image',
    images_upload_handler(blobInfo, success) {
        const file = new File([blobInfo.blob()], blobInfo.filename());
        const fileName = blobInfo.filename();

        if (fileName.includes("blobid")) {
            success(URL.createObjectURL(file));
        } else {
            editImageFiles.push(file); // Push image file to the array
            success(URL.createObjectURL(file));
        }
    }
});
function editProductSubmitForm() {

    editFormData.append("productId", $("#productId").val());
    editFormData.append("productName", $("#productName").val());
    editFormData.append("productSort", $("#productSort").val());
    editFormData.append("productPrice", $("#productPrice").val());
    editFormData.append("productDiscount", $("#productDiscount").val());
    editFormData.append("totalPrice", $("#totalPrice").val());
    editFormData.append("productInventory", $("#productInventory").val());
    editImageFiles.push($("#productPicture")[0].files[0]);

    const productDescription = tinymce.get("productDescription").getContent();
    editFormData.append("productDescription", productDescription);

    // Append productDescriptionImg files to formData
    for (const file of editImageFiles) {
        editFormData.append("imgFiles", file);
    }

    console.log(editImageFiles);

    axios({
        method: 'POST',
        url: '/admin/editProduct_ok',
        data: editFormData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(res => {
        if (res.data === 1) {
            $(".txt06").show();
            $("#errorMsg2").html("상품 수정에 성공했습니다!");
        }
    });
}