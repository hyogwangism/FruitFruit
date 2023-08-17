package com.shop.fruitfruit.admin;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.google.firebase.auth.FirebaseAuthException;
import com.shop.fruitfruit.firebase.FireBaseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j;
import lombok.extern.log4j.Log4j2;
import org.apache.ibatis.annotations.Param;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("admin")
@Log4j2
public class AdminController {

    private final FireBaseService fireBaseService;
    private final AdminService adminService;

    private final static String session_id = "adminSessionId";

//    @PostMapping("/files")
//    public String uploadFile(@RequestParam("file") MultipartFile file, String fileName, String path) throws IOException, FirebaseAuthException {
//        if(file.isEmpty()){
//            return "is empty";
//        }
//        return fireBaseService.uploadFiles(file, path, fileName);
//    }
    /**
     * @author 황호준
     *
     * 페이지 이동
     *
     */

    //admin - 로그인 페이지
    @RequestMapping("/adminLogin")
    public String adminMain() {
        return "/admin/index";
    }

    //admin - 메인(통계)
    @RequestMapping("/dashboard")
    public String dashboard() {
        return "/admin/dashboard";
    }



    //admin - 상품등록
    @RequestMapping("/product02")
    public String product02() {
        return "/admin/product02";
    }

    /**
     * @author 황호준
     *
     * 관리자 로그인 ok
     *
     * @param {string} 테이블 이름 ADMIN_USER
     * @param {String id => input에 입력한 id, String pw => input에 입력한 pw}
     */
    @RequestMapping("/adminLogin_ok")
    public String adminLogin_ok(Model model, HttpServletRequest request, String id, String pw) {
        if(id.equals(adminService.loginUserChk(id).get("ADMIN_ID").toString()) && pw.equals(adminService.loginUserChk(id).get("ADMIN_PWD").toString())){
            HttpSession session = request.getSession();
            session.setAttribute(session_id, id);
            return "redirect:/admin/dashboard";
        } else {
            model.addAttribute("errorMessage", "아이디 또는 비밀번호가 틀렸습니다.");

            return "redirect:/admin/adminLogin";
        }
    }

    /**
     * @author 황호준
     *
     * 상품 등록
     *
     * @param {string} 테이블 이름 Product, Image
     * @param
     * {
     *   String productName => 상품 이름
     *   String productSort => 상품 분류
     *   String productPrice => 상품 가격
     *   String productDiscount => 상품 할인율
     *   String productInventory => 재고 수량
     *   List<MultipartFile> imgFiles => 상품 메인이미지, 상세 이미지
     *   String productDescription => 상품 상세설명(HTML 형식)
     * }
     */
    @RequestMapping("/insertProduct")
    @ResponseBody
    @Transactional
    public int insertProduct(@RequestParam("productName") String productName,
                             @RequestParam("productSort") String productSort,
                             @RequestParam("productPrice") String productPrice,
                             @RequestParam("productDiscount") String productDiscount,
                             @RequestParam("productInventory") String productInventory,
                             @RequestParam("imgFiles") List<MultipartFile> imgFiles,
                             @RequestParam("productDescription") String productDescription
    ) throws IOException {

        List<HashMap<String, Object>> paramMapList = new ArrayList<>();
        HashMap<String, Object> paramMap = new HashMap<>();
        for (MultipartFile imgFile : imgFiles) {
            //Firebase에 이미지 저장
            paramMap = fireBaseService.uploadFiles(imgFile);
            paramMap.put("productName", productName);
            paramMap.put("productSort", productSort);
            paramMap.put("productPrice", productPrice);
            paramMap.put("productDiscount", productDiscount);
            paramMap.put("productInventory", productInventory);
            //Firebase에 등록된 URL로 변환
            String updatedDescription = productDescription.replaceAll("<img[^>]*src=[\"']([^\"^']*)[\"'][^>]*>", "<img src=\"" + paramMap.get("fireBaseImageUrl") + "\" />");
            paramMap.put("productDescription", updatedDescription);
            paramMapList.add(paramMap);
        }

        //Product 테이블에 삽입
        adminService.insertProduct(paramMap);
        //삽입된 상품의 productId 검색
        int productId = adminService.selectProductByProductName(productName);
        for (HashMap<String, Object> paramMaps : paramMapList) {
            paramMaps.put("productId", productId);
        }

        //Image 테이블에 삽입
        log.info("파람리스트:"+paramMapList);
        adminService.insertProductImage(paramMapList);
        paramMapList.add(paramMap);
        return 1;
    }

    /**
     * admin - 상품관리
     */

    @RequestMapping("product")
    public String product(Model model, @RequestParam(defaultValue = "1") int pageNum, @RequestParam(defaultValue = "5") int pageSize) {

        PageHelper.startPage(pageNum, pageSize);

        List<HashMap<String, Object>> productList = adminService.selectAllProduct();
        PageInfo<HashMap<String, Object>> pageInfo = new PageInfo<>(productList);
        // 판매중인 상품의 수를 계산하여 모델에 추가한다
        long saleCount = productList.stream()
                .filter(product -> "판매중".equals(product.get("PRODUCT_SALE_STATUS")))
                .count();
        long nonSaleCount = productList.stream()
                .filter(product -> "판매중지".equals(product.get("PRODUCT_SALE_STATUS")))
                .count();
        long soldOutCount = productList.stream()
                .filter(product -> 0 == (int) product.get("PRODUCT_INVENTORY"))
                .count();

        model.addAttribute("saleCount", saleCount);
        log.info("셀카:"+saleCount);
        model.addAttribute("nonSaleCount", nonSaleCount);
        model.addAttribute("soldOutCount", soldOutCount);
        model.addAttribute("pageInfo", pageInfo);
        log.info("첫 페이지인뽕:" + pageInfo);

        return "/admin/product";
    }

    @RequestMapping("/productAxios")
    @ResponseBody
    public PageInfo<HashMap<String, Object>> productAxios(@RequestBody HashMap<String, Object> paramMap){
        List<HashMap<String, Object>> productList = adminService.selectProductByCondition(paramMap);
        PageInfo<HashMap<String, Object>> pageInfo = new PageInfo<>(productList);

        log.info("프로덕트리스트:" + productList);
        log.info("페이지인포:" + pageInfo);
        log.info("해쉬코드1:" +  Integer.parseInt(paramMap.get("pageSize").toString()));
        log.info("해쉬코드2:" +  paramMap.get("pageSize").hashCode());
        return pageInfo;
    }

    @RequestMapping("/saleStop")
    @ResponseBody
    @Transactional
    public HashMap<String, Object> saleStop(@RequestBody HashMap<String, Object> paramMap){
        log.info("업파람" + paramMap);
        adminService.updateSaleStatusDate(paramMap);
        HashMap<String, Object> updatedSaleStatusDate = adminService.updatedSaleStatusDate(paramMap);
        log.info("업뎃셀력" + updatedSaleStatusDate);
        return updatedSaleStatusDate;
    }

    @RequestMapping("/editProduct")
    public String editProduct(Model model, int productId) {
        HashMap<String, Object> pInfo = adminService.selectProductbyProductId(productId);
        List<HashMap<String, Object>> pPictureInfo = adminService.selectPicturebyProductId(productId);
        model.addAttribute("productId", productId);
        model.addAttribute("pInfo", pInfo);
        model.addAttribute("pPictureInfo", pPictureInfo);
        return "admin/editProduct";
    }

    @RequestMapping("/editProduct_ok")
    @ResponseBody
    @Transactional
    public int editProduct_ok(
                             @RequestParam("productId") int productId,
                             @RequestParam("productName") String productName,
                             @RequestParam("productSort") String productSort,
                             @RequestParam("productPrice") String productPrice,
                             @RequestParam("productDiscount") String productDiscount,
                             @RequestParam("productInventory") String productInventory,
                             @RequestParam("imgFiles") List<MultipartFile> imgFiles,
                             @RequestParam("productDescription") String productDescription
    ) throws IOException {

        List<HashMap<String, Object>> paramMapList = new ArrayList<>();
        HashMap<String, Object> paramMap = new HashMap<>();
        for (MultipartFile imgFile : imgFiles) {
            //Firebase에 이미지 저장
            paramMap = fireBaseService.uploadFiles(imgFile);
            paramMap.put("productName", productName);
            paramMap.put("productSort", productSort);
            paramMap.put("productPrice", productPrice);
            paramMap.put("productDiscount", productDiscount);
            paramMap.put("productInventory", productInventory);
            //Firebase에 등록된 URL로 변환
            String updatedDescription = productDescription.replaceAll("<img[^>]*src=[\"']([^\"^']*)[\"'][^>]*>", "<img src=\"" + paramMap.get("fireBaseImageUrl") + "\" />");
            paramMap.put("productDescription", updatedDescription);
            paramMapList.add(paramMap);
        }

        paramMap.put("productId", productId);
        //Product 테이블에 삽입
        adminService.updateProduct(paramMap);
//        //삽입된 상품의 productId 검색
//        int productId = adminService.selectProductByProductName(productName);
//        for (HashMap<String, Object> paramMaps : paramMapList) {
//            paramMaps.put("productId", productId);
//        }
//
//        //Image 테이블에 삽입
//        log.info("파람리스트:"+paramMapList);
//        adminService.insertProductImage(paramMapList);
//        paramMapList.add(paramMap);
        return 1;
    }

    @RequestMapping("/selectedSaleStop")
    @ResponseBody
//    @Transactional
    public int selectedSaleStop(@RequestBody HashMap<String, Object> paramMap){
        log.info("선택아이디" + paramMap);
        //상품ID별 판매중지 update
        adminService.updateSalectedSaleStop(paramMap);

        //update 된 상품들 정보 가져오기
//        List<HashMap<String, Object>> updatedSaleStatusDate = adminService.selectSaleStopProducts(requestData);
//        log.info("업뎃셀력" + updatedSaleStatusDate);
        return 1;
    }

    @RequestMapping("/selectedDelete")
    @ResponseBody
    @Transactional
    public int deleteImageFiles (@RequestBody HashMap<String, Object> paramMap){
        List<HashMap<String, Object>> paramList = adminService.selectSaleStopProducts(paramMap);
        fireBaseService.deleteImageFiles(paramList);
        return 1;
    }
}