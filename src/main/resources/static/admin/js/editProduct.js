let imageFiles = [];
let formData = new FormData();

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
            imageFiles.push(file); // Push image file to the array
            success(URL.createObjectURL(file));
        }
    }
});
function productSubmitForm() {

    formData.append("productName", $("#productName").val());
    formData.append("productSort", $("#productSort").val());
    formData.append("productPrice", $("#productPrice").val());
    formData.append("productDiscount", $("#productDiscount").val());
    formData.append("totalPrice", $("#totalPrice").val());
    formData.append("productInventory", $("#productInventory").val());
    imageFiles.push($("#productPicture")[0].files[0]);

    const productDescription = tinymce.get("productDescription").getContent();
    formData.append("productDescription", productDescription);

    // Append productDescriptionImg files to formData
    for (const file of imageFiles) {
        formData.append("imgFiles", file);
    }

    console.log(imageFiles);

    axios({
        method: 'POST',
        url: '/admin/insertProduct',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(res => {
        if (res.data === 1) {
            $(".txt06").show();
            $("#errorMsg2").html("상품 등록에 성공했습니다!");
        }
    });
}