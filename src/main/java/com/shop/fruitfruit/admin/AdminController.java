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
    public String adminMain(HttpSession session) {
        if(session.getAttribute("admin_sessionId")!=null) {

            return "/admin/dashboard";
        } else {
            return "/admin/index";
        }
    }

    //admin - 메인(통계)
    @RequestMapping("/dashboard")
    public String dashboard(HttpSession session, Model model) {
        if(session.getAttribute("admin_sessionId")!=null) {

            return "/admin/dashboard";
        } else {
            model.addAttribute("adminErrorMessage", "관리자로 로그인 해주세요.");
            return "/admin/index";
        }

    }



    //admin - 상품등록
    @RequestMapping("/product02")
    public String product02(HttpSession session, Model model) {
        if(session.getAttribute("admin_sessionId")!=null){
            return "/admin/product02";
        } else {
            model.addAttribute("adminErrorMessage", "관리자로 로그인 해주세요.");
            return "/admin/index";
        }
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
    public String adminLogin_ok(Model model, HttpSession session, String id, String pw) {
        if(adminService.loginUserChk(id)!=null){
            if(id.equals(adminService.loginUserChk(id).get("ADMIN_ID").toString()) && pw.equals(adminService.loginUserChk(id).get("ADMIN_PWD").toString())){
                session.setAttribute("admin_sessionId", id);
                return "redirect:/admin/dashboard";
        } else {
                model.addAttribute("errorMessage", "아이디 또는 비밀번호가 틀렸습니다.");
                return "/admin/index";
            }

        } else {
            model.addAttribute("errorMessage", "아이디 또는 비밀번호가 틀렸습니다.");
            return "/admin/index";
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
    public int insertProduct(HttpSession session,
                             @RequestParam("productName") String productName,
                             @RequestParam("productSort") String productSort,
                             @RequestParam("productPrice") String productPrice,
                             @RequestParam("productDiscount") String productDiscount,
                             @RequestParam("productInventory") String productInventory,
                             @RequestParam("imgFiles") List<MultipartFile> imgFiles,
                             @RequestParam("productDescription") String productDescription
    ) throws IOException {

        if (session.getAttribute("admin_sessionId") != null) {
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
            log.info("파람리스트:" + paramMapList);
            adminService.insertProductImage(paramMapList);
            paramMapList.add(paramMap);
            return 1;
        } else {
            return -1;
        }
    }

    /**
     * admin - 상품관리
     */

    @RequestMapping("product")
    public String product(HttpSession session, Model model, @RequestParam(defaultValue = "1") int pageNum, @RequestParam(defaultValue = "5") int pageSize) {

        if (session.getAttribute("admin_sessionId") != null) {
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
            log.info("셀카:" + saleCount);
            model.addAttribute("nonSaleCount", nonSaleCount);
            model.addAttribute("soldOutCount", soldOutCount);
            model.addAttribute("pageInfo", pageInfo);
            log.info("첫 페이지인뽕:" + pageInfo);

            return "/admin/product";
        } else {
            model.addAttribute("adminErrorMessage", "관리자로 로그인 해주세요.");
            return "/admin/index";
        }
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
    public String editProduct(HttpSession session, Model model, int productId) {
        if (session.getAttribute("admin_sessionId") != null) {
            HashMap<String, Object> pInfo = adminService.selectProductbyProductId(productId);
            List<HashMap<String, Object>> pPictureInfo = adminService.selectPicturebyProductId(productId);
            model.addAttribute("productId", productId);
            model.addAttribute("pInfo", pInfo);
            model.addAttribute("pPictureInfo", pPictureInfo);
            return "admin/editProduct";
        } else {
            model.addAttribute("adminErrorMessage", "관리자로 로그인 해주세요.");
            return "/admin/index";
        }
    }

    @RequestMapping("/editProduct_ok")
    @ResponseBody
    @Transactional
    public int editProduct_ok(HttpSession session,
                             @RequestParam("productId") int productId,
                             @RequestParam("productName") String productName,
                             @RequestParam("productSort") String productSort,
                             @RequestParam("productPrice") String productPrice,
                             @RequestParam("productDiscount") String productDiscount,
                             @RequestParam("productInventory") String productInventory,
                             @RequestParam("imgFiles") List<MultipartFile> imgFiles,
                             @RequestParam("productDescription") String productDescription
    ) throws IOException {
        if (session.getAttribute("admin_sessionId") != null) {

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
        } else {
            return -1;
        }
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

    //admin - 리뷰
    @RequestMapping("/review")
    public String adminReview(HttpSession session, Model model, @RequestParam(defaultValue = "1") int pageNum, @RequestParam(defaultValue = "5") int pageSize) {
        if(session.getAttribute("admin_sessionId")!=null) {
            HashMap<String, Object> paramMap = new HashMap<>();
            paramMap.put("startPage", pageNum);
            paramMap.put("pageSize", pageSize);

            //전체 리뷰 리스트
            List<HashMap<String, Object>> reviewList = adminService.selectReview(paramMap);
            log.info("리뷰전체리스트: "+reviewList);
            PageInfo<HashMap<String, Object>> pageInfo = new PageInfo<>(reviewList);
            model.addAttribute("pageInfo", pageInfo);

            //리뷰 답변 카운트
            HashMap<String, Object> countMap = adminService.countReview();
            log.info("리뷰갯수: " + countMap);
            model.addAttribute("reviewCountMap", countMap);
            return "/admin/review";
        } else {
            model.addAttribute("adminErrorMessage", "관리자로 로그인 해주세요.");
            return "/admin/index";
        }

    }

    /**
     * 리뷰관리 Axios
     */
    @RequestMapping("reviewAxios")
    @ResponseBody
    public HashMap<String, Object> reviewAxios(@RequestBody HashMap<String, Object> paramMap){
        log.info("리뷰파람맵: " + paramMap);

        //조건에 따라 리뷰리스트 검색
        List<HashMap<String, Object>> reviewList = adminService.selectReview(paramMap);
        PageInfo<HashMap<String, Object>> pageInfo = new PageInfo<>(reviewList);
        log.info("리뷰전체리스트: "+reviewList);

        //조건에따라 나오는 리뷰리스트 갯수
        int searchReviewCount = adminService.countSearchReview(paramMap);
        log.info("검색갯수: " + searchReviewCount);
        HashMap<String, Object> resultMap = new HashMap<>();
        resultMap.put("pageInfo", pageInfo);
        resultMap.put("searchReviewCount", searchReviewCount);

        return resultMap;
    }

    /**
     * 리뷰답글 보기, 쓰기
     */
    @RequestMapping("reviewReplyView")
    @ResponseBody
    public HashMap<String, Object> reviewReplyView(@RequestBody HashMap<String, Object> paramMap){
        log.info("리뷰답변 파람맵: "+paramMap);
        log.info("리뷰답변 리스트: "+adminService.selectReview(paramMap));
        for(HashMap<String, Object> reviewReplyMap : adminService.selectReview(paramMap)){
            paramMap.putAll(reviewReplyMap);
        }
        log.info("리뷰아이디 리뷰내용 결과값: "+paramMap);
        return paramMap;
    }

    @RequestMapping("reviewReplyWrite_ok")
    @ResponseBody
    public String reviewReplyWrite_ok(@RequestBody HashMap<String, Object> paramMap){
        log.info("리뷰답변작성 파람맵: "+paramMap);
        adminService.insertReviewReply(paramMap);
        adminService.updateReviewStatus(paramMap);
        return "성공";
    }
}

