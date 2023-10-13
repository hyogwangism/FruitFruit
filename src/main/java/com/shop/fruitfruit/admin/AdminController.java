package com.shop.fruitfruit.admin;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.google.firebase.auth.FirebaseAuthException;
import com.shop.fruitfruit.firebase.FireBaseService;
import com.shop.fruitfruit.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j;
import lombok.extern.log4j.Log4j2;
import org.apache.ibatis.annotations.Param;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.IOException;
import java.net.http.HttpRequest;
import java.util.*;

@Controller
@RequiredArgsConstructor
@RequestMapping("admin")
@Log4j2
@Transactional
@EnableScheduling
public class AdminController {

    private final FireBaseService fireBaseService;
    private final AdminService adminService;
    private final UserService userService;


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
     * 페이지 이동(관리자 - 로그인 페이지, 메인(대쉬보드), 상품등록
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
     *
     * @returns 성공시 1, 실패시 -1 반환
     */
    @RequestMapping("/insertProduct")
    @ResponseBody
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
     * @author 황호준
     *
     * 상품 관리
     *
     * @param {string} 테이블 이름 Product
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

    /**
     * @author 황호준
     *
     * 상품관리 비동기
     *
     * @param {string} 테이블 이름 Product
     * @param
             data: {
                    "productSaleStatus": productSaleStatusVal, 판매상태(판매중, 중지, 품절)
                    "productSort": productSortVal, 상품 분류
                    "searchField": searchFieldVal, 검색어
                    "startPage": currentPage, 현재페이지
                    "pageSize": pageSizeVal 한 페이지에 보여질 개수
                    },
     *
     * @returns 상품리스트
     */
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

    /**
     * @author 황호준
     *
     * 판매중지 비동기
     *
     * @param {string} 테이블 이름 Product
     * @param
                    data: {
                             productId: productId, 상품아이디
                             status: "판매중지"
                            },
     *
     * @returns 중지된 상품 정보
     */
    @RequestMapping("/saleStop")
    @ResponseBody
    public HashMap<String, Object> saleStop(@RequestBody HashMap<String, Object> paramMap){
        log.info("업파람" + paramMap);

        // 선택상품 상품중지 후 상품중지일 update
        adminService.updateSaleStatusDate(paramMap);

        // 중지된 선택상품 정보 select
        HashMap<String, Object> updatedSaleStatusDate = adminService.updatedSaleStatusDate(paramMap);
        log.info("업뎃셀력" + updatedSaleStatusDate);
        return updatedSaleStatusDate;
    }

    /**
     * @author 황호준
     *
     * 상품수정
     *
     * @param {string} 테이블 이름 Product, Image
     * @param productId 상품아이디
     *
     */
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

    /**
     * @author 황호준
     *
     * 상품수정 ok 비동기
     *
     * @param {string} 테이블 이름 Product
     * @param
             @RequestParam("productId") int productId, 상품아이디
             @RequestParam("productName") String productName, 상품명
             @RequestParam("productSort") String productSort, 상품분류
             @RequestParam("productPrice") String productPrice, 상품가격
             @RequestParam("productDiscount") String productDiscount, 상품할인율
             @RequestParam("productInventory") String productInventory, 상품재고
             @RequestParam("imgFiles") List<MultipartFile> imgFiles, 상품이미지
             @RequestParam("productDescription") String productDescription 상품상세설명
     *
     * @returns 수정 성공시 1, 실패시 -1 반환
     */
    @RequestMapping("/editProduct_ok")
    @ResponseBody
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

    /**
     * @author 황호준
     *
     * 선택 상품 판매 중지 비동기
     *
     * @param {string} 테이블 이름 Product
     * @param
                  data: {
                           "selectedProductId" : selectedStopValues 선택된 상품아이디 배열
                          },
      *
      * @returns 성공시 1반환
     */
    @RequestMapping("/selectedSaleStop")
    @ResponseBody
    public int selectedSaleStop(@RequestBody HashMap<String, Object> paramMap){
        log.info("선택아이디" + paramMap);
        //상품ID별 판매중지 update
        adminService.updateSalectedSaleStop(paramMap);

        //update 된 상품들 정보 가져오기
//        List<HashMap<String, Object>> updatedSaleStatusDate = adminService.selectSaleStopProducts(requestData);
//        log.info("업뎃셀력" + updatedSaleStatusDate);
        return 1;
    }

    /**
     * @author 황호준
     *
     * 선택 상품 판매 삭제 비동기
     *
     * @param {string} 테이블 이름 Product
     * @param
    data: {
    "selectedProductId" : selectedStopValues 선택된 상품아이디 배열
    },
     *
     * @returns 성공시 1반환
     */
    @RequestMapping("/selectedDelete")
    @ResponseBody
    public int deleteImageFiles (@RequestBody HashMap<String, Object> paramMap){
        List<HashMap<String, Object>> paramList = adminService.selectSaleStopProducts(paramMap);
        fireBaseService.deleteImageFiles(paramList);
        return 1;
    }

    /**
     * @author 황호준
     *
     * 리뷰관리 페이지
     *
     * @param {string} 테이블 이름 review, review_reply
     */
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

            /**
             * 리뷰 개수 카운트
             * @returns
             * TOTAL_REVIEW_COUNT 전체 리뷰수
             * UNANSWERED_REVIEW_COUNT 답변 X 개수
             * ANSWERED_REVIEW_COUNT 답변 O 개수
             */
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
     * @author 황호준
     *
     * 리뷰관리 페이지 비동기
     *
     * @param {string} 테이블 이름 review, review_reply
     * @param
     *             data: {
                            'replyStatus' : replyStatusVal, 답변상태
                            'searchType' : searchTypeVal, 검색종류
                            "searchField": searchFieldVal, 검색어
                            "startDate": startDateValue, 기간검색 시작일
                            "endDate": endDateValue, 기간검색 종료일
                            "startPage": currentPage, 현재페이지
                            "pageSize": pageSizeVal 한 페이지에 보여질 개수
                        },
     *
     * @returns Map(리뷰리스트, 검색결과 리스트 개수)
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
     * @author 황호준
     *
     * 리뷰관리 답글 보기, 쓰기
     *
     * @param {string} 테이블 이름 review, review_reply
     * @param
                    data: {
                             'REVIEW_ID': REVIEW_ID, 리뷰아이디
                             'ORDER_ID': ORDER_ID, 주문아이디
                             'startPage': currentPage, 현재페이지
                             'pageSize': pageSizeVal 현제페이지에 보여줄 개수
                             },
     *
     * @returns Map(해당 리뷰, 리뷰답변 정보)
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

    /**
     * @author 황호준
     *
     * 리뷰답글 작성 ok
     *
     * @param {string} 테이블 이름 review_reply
     * @param
                 data: {
                         'REVIEW_ID': review_id, 리뷰아이디
                         'REVIEW_REPLY_CONT': review_reply_cont 리뷰 답글 내용
                        },
     *
     * @returns 성공시 '성공' 반환
     */
    @RequestMapping("reviewReplyWrite_ok")
    @ResponseBody
    public String reviewReplyWrite_ok(@RequestBody HashMap<String, Object> paramMap){
        log.info("리뷰답변작성 파람맵: "+paramMap);
        adminService.insertReviewReply(paramMap);
        adminService.updateReviewStatus(paramMap);
        return "성공";
    }

    /**
     * @author 황호준
     *
     * 회원관리 페이지
     *
     * @param {string} 테이블 이름 USER
     */
    @RequestMapping("/member")
    public String member(HttpSession session, Model model, @RequestParam(defaultValue = "1") int pageNum, @RequestParam(defaultValue = "5") int pageSize) {
        if(session.getAttribute("admin_sessionId")!=null) {
            HashMap<String, Object> paramMap = new HashMap<>();
            paramMap.put("startPage", pageNum);
            paramMap.put("pageSize", pageSize);

            List<HashMap<String, Object>> memberList = adminService.adminSelectMember(paramMap);
            //전체 회원 리스트
            log.info("회원전체리스트: "+memberList);

            PageInfo<HashMap<String, Object>> pageInfo = new PageInfo<>(memberList);
            log.info("카운트 들어간 페이지인포: "+pageInfo);

            model.addAttribute("pageInfo", pageInfo);

            /**
             * 회원 상태 카운트
             * @returns
             * TOTAL_MEMBER_COUNT 전체 회원수
             * ACTIVATING_USER 활동중 회원수
             * NON_ACTIVATING_USER 탈퇴 회원수
             */
            HashMap<String, Object> countMap = adminService.countMember();
            log.info("회원 상태 갯수: " + countMap);
            model.addAttribute("memberCountMap", countMap);

            return "/admin/member";
        } else {
            model.addAttribute("adminErrorMessage", "관리자로 로그인 해주세요.");
            return "/admin/index";
        }

    }

    /**
     * @author 황호준
     *
     * 회원관리 페이지 비동기
     *
     * @param {string} 테이블 이름 USER
     *
     * @param
     *             data: {
     *                 'userStatus' : userStatusVal, 회원상태
     *                 'searchType' : searchTypeVal, 검색어 종류
     *                 "searchField": searchFieldVal, 검색어
     *                 "startPage": currentPage, 현재페이지
     *                 "pageSize": pageSizeVal 현재페이지에 보여질 개수
     *             },
     * @returns Map(회원리스트, 검색조건에 따라 검색되는 회원수)
     */
    @RequestMapping("memberAxios")
    @ResponseBody
    public HashMap<String, Object> memberAxios(@RequestBody HashMap<String, Object> paramMap) {
        log.info("멤버파람맵: " + paramMap);

        List<HashMap<String, Object>> memberList = adminService.adminSelectMember(paramMap);
        //전체 회원 리스트
        log.info("회원전체리스트: " + memberList);

        PageInfo<HashMap<String, Object>> pageInfo = new PageInfo<>(memberList);
        log.info("카운트 들어간 페이지인포: " + pageInfo);

        //조건에따라 나오는 회원명수
        int searchMemberCount = adminService.countSearchMember(paramMap);
        log.info("검색갯수: " + searchMemberCount);
        HashMap<String, Object> resultMap = new HashMap<>();
        resultMap.put("pageInfo", pageInfo);
        resultMap.put("searchMemberCount", searchMemberCount);

        return resultMap;
    }

    /**
     * @author 황호준
     *
     * 멤버 주문내역 보기
     *
     * @param {string} 테이블 이름 - ORDER_TABLE, ORDER_PRODUCT, USER_DELIVER_INFO, PRODUCT, IMAGE
     *
     */
    @RequestMapping("memberOrderListView")
    public String memberOrderListView(HttpSession session, Model model,
                                      @RequestParam String USER_ID_NO,
                                      @RequestParam(defaultValue = "1") int pageNum,
                                      @RequestParam(defaultValue = "5") int pageSize) {
        HashMap<String, Object> paramMap = new HashMap<>();
        paramMap.put("USER_ID_NO", USER_ID_NO);
        paramMap.put("startPage", pageNum);
        paramMap.put("pageSize", pageSize);

        log.info("유아넘gg: " + USER_ID_NO);

        PageInfo<HashMap<String, Object>> pageInfo = adminService.userOrderMethod(paramMap);


        log.info("유저 페이지리스트: " + pageInfo);

        model.addAttribute("pageInfo", pageInfo); // 수정된 코드로 변경

        return "admin/memberOrderListModal";
    }

    /**
     * @author 황호준
     *
     * 선택된 유저 탈퇴
     *
     * @param {string} 테이블 이름 USER
     *
     * @param
     *            data: {
     *                  "selectedUserIdNo" : selectedWithdrawalValues 선택된 유저 아이디 배열
     *                  },
     *
     * @returns 성공시 1 반환
     */
    @RequestMapping("selectedWithdrawal")
    @ResponseBody
    public int selectedWithdrawal(@RequestBody HashMap<String, Object> paramMap) {
        log.info("회원아이디넘버: " + paramMap);

        //선택아이디 탈퇴
        adminService.withdrawalUser(paramMap);

        log.info("유저아이디 길이 : "+paramMap.get("selectedUserIdNo").toString().length());

        //선택된 아이디가 1개 일때(중지 버튼 누를때)
        if(paramMap.get("selectedBannerId").toString().length()==1){
            List<Integer> selectedUserIdNo = new ArrayList<>();
            selectedUserIdNo.add(Integer.parseInt(paramMap.get("selectedUserIdNo").toString())); // 예시: 중지하려는 배너 ID를 리스트에 추가
            paramMap.put("selectedUserIdNo", selectedUserIdNo);
            log.info("유저아이디: " + paramMap);
            adminService.withdrawalUser(paramMap);

        } else {
            log.info("유저아이디: " + paramMap);
            adminService.withdrawalUser(paramMap);
        }
        return 1;
    }

    /**
     * @author 황호준
     *
     * 배너관리 페이지
     *
     * @param {string} 테이블 이름 BANNER
     *
     * @returns 성공시 1 반환
     */
    @RequestMapping("banner")
    public String goBanner(HttpSession session, Model model, @RequestParam(defaultValue = "1") int pageNum, @RequestParam(defaultValue = "5") int pageSize ) {
        if(session.getAttribute("admin_sessionId")!=null) {
            HashMap<String, Object> paramMap = new HashMap<>();
            paramMap.put("startPage", pageNum);
            paramMap.put("pageSize", pageSize);

            //전체 배너 리스트
            List<HashMap<String, Object>> bannerList = adminService.adminSelectBanner(paramMap);
            log.info("배너전체리스트: " + bannerList);

            PageInfo<HashMap<String, Object>> pageInfo = new PageInfo<>(bannerList);
            log.info("카운트 들어간 페이지인포: "+pageInfo);

            model.addAttribute("pageInfo", pageInfo);

            //배너 상태 카운트
            HashMap<String, Object> countMap = adminService.countBanner();
            log.info("배너 상태 갯수: " + countMap);
            model.addAttribute("bannerCountMap", countMap);

            return "/admin/banner";
        } else {
            model.addAttribute("adminErrorMessage", "관리자로 로그인 해주세요.");
            return "/admin/index";
        }
    }

    /**
     * @author 황호준
     *
     * 배너관리 페이지 비동기
     *
     * @param {string} 테이블 이름 BANNER
     *
     * @param
                      data: {
                              'bannerStatus' : bannerStatusVal, 배너 게시상태
                              "searchField": searchFieldVal, 검색어
                              "startPage": currentPage, 현재 페이지 넘버
                              "pageSize": pageSizeVal 현재 페이지에 보여줄 목록 수
                             },
     *
     * @returns 조건에 따른 배너리스트, 리스트 개수
     */
    @RequestMapping("bannerAxios")
    @ResponseBody
    public HashMap<String, Object> bannerAxios(@RequestBody HashMap<String, Object> paramMap) {
        log.info("배너파람맵: " + paramMap);

        //전체 배너 리스트
        List<HashMap<String, Object>> bannerList = adminService.adminSelectBanner(paramMap);
        log.info("배너전체리스트: " + bannerList);

        PageInfo<HashMap<String, Object>> pageInfo = new PageInfo<>(bannerList);
        log.info("카운트 들어간 페이지인포: " + pageInfo);

        //조건에따라 나오는 배너수
        int searchBannerCount = adminService.countSearchBanner(paramMap);
        log.info("검색갯수: " + searchBannerCount);
        HashMap<String, Object> resultMap = new HashMap<>();
        resultMap.put("pageInfo", pageInfo);
        resultMap.put("searchBannerCount", searchBannerCount);

        return resultMap;
    }

    /**
     * @author 황호준
     *
     * 배너관리 페이지 배너 이미지보기 비동기
     *
     * @param {string} 테이블 이름 BANNER
     *
     * @param
                      data: {
                            'BANNER_ID': bannerId 배너아이디
                              },
     *
     * @returns 배너아이디 조건 해당 배너 정보
     */
    @RequestMapping("showBannerImg")
    @ResponseBody
    public HashMap<String, Object> showBannerImg(@RequestBody HashMap<String, Object> paramMap) {
        log.info("배너아이디: " + paramMap);

        //배너아이디 조건 해당 배너 정보
        HashMap<String, Object> selectBannerMap = adminService.adminSelectBannerByBannerId(paramMap);
        log.info("선택배너맵: " + selectBannerMap);

        return selectBannerMap;
    }

    /**
     * @author 황호준
     *
     * 배너등록 페이지 이동
     */
    @RequestMapping("banner/write")
    public String goBannerWrite(){
        return "admin/banner02";
    }

    /**
     * @author 황호준
     *
     * 배너등록 ok
     *
     * @param {string} 테이블 이름 BANNER
     *
     * @param
                @RequestParam("bannerTitle") String bannerTitle, 배너 제목
                @RequestParam("bannerStartDate") String bannerStartDate, 배너 게시시작일
                @RequestParam("bannerEndDate") String bannerEndDate, 배너 게시종료일
                @RequestParam("bannerHowLong") String bannerHowLong, 배너 게시기간
                @RequestParam("bannerShowTime") String bannerShowTime, 배너 홈페이지에 보여지는 시간초
                @RequestParam("bannerImg") MultipartFile bannerImg 배너 이미지
     *
     * @returns 등록 성공시 1, 실패시 -1 반환
     */
    @RequestMapping("/insertBanner")
    @ResponseBody
    public int insertProduct(HttpSession session,
                             @RequestParam("bannerTitle") String bannerTitle,
                             @RequestParam("bannerStartDate") String bannerStartDate,
                             @RequestParam("bannerEndDate") String bannerEndDate,
                             @RequestParam("bannerHowLong") String bannerHowLong,
                             @RequestParam("bannerShowTime") String bannerShowTime,
                             @RequestParam("bannerImg") MultipartFile bannerImg
    ) throws IOException {

        log.info("배너 값 확인 == " + "타이틀 : " + bannerTitle + ", 시작일 : " + bannerStartDate + ", 종료일 : " + bannerEndDate + ", 기간 : " + bannerHowLong + ", 보여지는시간 : " + bannerShowTime + ", 이미지 : " + bannerImg);
        if (session.getAttribute("admin_sessionId") != null) {
            HashMap<String, Object> paramMap;
            //Firebase에 이미지 저장
            paramMap = fireBaseService.bannerImg(bannerImg);
            paramMap.put("bannerTitle", bannerTitle);
            paramMap.put("bannerStartDate", bannerStartDate);
            paramMap.put("bannerEndDate", bannerEndDate);
            paramMap.put("bannerHowLong", bannerHowLong);
            paramMap.put("bannerShowTime", bannerShowTime);

            //banner 테이블에 삽입
            adminService.insertBanner(paramMap);

            return 1;
        }
        return -1;
    }


    /**
     * @author 황호준
     *
     * 배너수정 페이지 이동
     *
     * @param {string} 테이블 이름 BANNER
     *
     * @param BANNER_ID 배너 아이디
     *
     */
    @RequestMapping("/banner/edit")
    public String goBannerEdit(HttpSession session, Model model, @Param(value = "bannerId") int bannerId) {
        log.info("배너아이디: " + bannerId);
        HashMap<String, Object> paramMap = new HashMap<>();
        paramMap.put("BANNER_ID", bannerId);

        //세션 아이디가 없을 때 = 로그인 하지 않았을 때
        if (session.getAttribute("admin_sessionId") != null) {

            //배너Id 기준으로 상품 정보 select
            HashMap<String, Object> selectBannerMap = adminService.adminSelectBannerByBannerId(paramMap);
            log.info("배너아이디기준 배너정보:" + selectBannerMap);

            model.addAttribute("selectBannerMap", selectBannerMap);

            return "admin/bannerEdit";

            //로그인이 되었을 때
        } else {
            model.addAttribute("adminErrorMessage", "관리자로 로그인 해주세요.");
            return "/admin/index";
        }

    }

    /**
     * @author 황호준
     *
     * 배너수정 ok
     *
     * @param {string} 테이블 이름 BANNER
     * @param
                @RequestParam("BANNER_ID") String BANNER_ID, 배너 아이디
                @RequestParam("bannerTitle") String bannerTitle, 배너 제목
                @RequestParam("bannerStartDate") String bannerStartDate, 배너 게시 시작일
                @RequestParam("bannerEndDate") String bannerEndDate, 배너 게시 종료일
                @RequestParam("bannerHowLong") String bannerHowLong, 배너 게시기간
                @RequestParam("bannerShowTime") String bannerShowTime, 배너 홈페이지 게시 시간초
                @RequestParam(value = "bannerEditImg", required = false) MultipartFile bannerEditImg 배너 이미지
     *
     * @returns 성공시 1반환
     */
    @RequestMapping("/editBanner")
    @ResponseBody
    public int editBanner(HttpSession session,
                             @RequestParam("BANNER_ID") String BANNER_ID,
                             @RequestParam("bannerTitle") String bannerTitle,
                             @RequestParam("bannerStartDate") String bannerStartDate,
                             @RequestParam("bannerEndDate") String bannerEndDate,
                             @RequestParam("bannerHowLong") String bannerHowLong,
                             @RequestParam("bannerShowTime") String bannerShowTime,
                             @RequestParam(value = "bannerEditImg", required = false) MultipartFile bannerEditImg
    ) throws IOException {
        HashMap<String, Object> paramMap = new HashMap<>();
        paramMap.put("BANNER_ID", BANNER_ID);
        paramMap.put("bannerTitle", bannerTitle);
        paramMap.put("bannerStartDate", bannerStartDate);
        paramMap.put("bannerEndDate", bannerEndDate);
        paramMap.put("bannerHowLong", bannerHowLong);
        paramMap.put("bannerShowTime", bannerShowTime);
        paramMap.put("bannerEditImg", bannerEditImg);

        //배너이미지가 변경되었을때
        if(bannerEditImg != null) {
            log.info("배너 값 확인(이미지변경) == " + "타이틀 : " + bannerTitle + ", 시작일 : " + bannerStartDate + ", 종료일 : " + bannerEndDate + ", 기간 : "
                    + bannerHowLong + ", 보여지는시간 : " + bannerShowTime + ", 이미지 : " + bannerEditImg);

            //firebase에 업로드 후 URL과 저장경로 담기
            paramMap.putAll(fireBaseService.bannerImg(bannerEditImg));

            //배너 정보 변경
            adminService.editBannerChangeImg(paramMap);

        //배너이미지가 이전과 동일할 떄
        } else{
            log.info("배너 값 확인(이미지그대로) == " + "타이틀 : " + bannerTitle + ", 시작일 : " + bannerStartDate + ", 종료일 : " + bannerEndDate + ", 기간 : "
                    + bannerHowLong + ", 보여지는시간 : " + bannerShowTime + ", 이미지 : " + bannerEditImg);

            //배너 정보 변경
            adminService.editBannerNONChangeImg(paramMap);
        }
        return 1;
    }

    /**
     * @author 황호준
     *
     * 배너게시 중지 비동기
     *
     * @param {string} 테이블 이름 BANNER
     * @param
                        data: {
                                 "selectedBannerId" : selectedBannerStopValues 배너 아이디 배열
                              },
      *
      * @returns 성공시 1반환
     */
    @RequestMapping("selectedBannerStop")
    @ResponseBody
    public int selectedBannerStop(@RequestBody HashMap<String, Object> paramMap){

        log.info("배너아이디 길이 : "+paramMap.get("selectedBannerId").toString().length());

        //선택된 배너 아아디가 1개일떄
        if(paramMap.get("selectedBannerId").toString().length()==1){
            List<Integer> selectedBannerId = new ArrayList<>();
            selectedBannerId.add(Integer.parseInt(paramMap.get("selectedBannerId").toString())); // 예시: 중지하려는 배너 ID를 리스트에 추가
            paramMap.put("selectedBannerId", selectedBannerId);
            log.info("배너아이디: " + paramMap);
            adminService.selectedBannerStop(paramMap);

        // 선택된 배너 아이디가 여러개일떄
        } else {
            log.info("배너아이디: " + paramMap);
            adminService.selectedBannerStop(paramMap);
        }
        return 1;
    }

//    /**
//     * 멤버 주문내역보기, 쓰기
//     */
//    @RequestMapping("memberOrderListView")
//    @ResponseBody
//    public HashMap<String, Object> memberOrderListView(@RequestBody HashMap<String, Object> paramMap) {
//        log.info("멤버아이디 파람맵: " + paramMap);
//        List<HashMap<String, Object>> orderList = adminService.adminSelectOrderList(paramMap);
//        log.info("유저 오더리스트: " + orderList);
//
//        return null;
//    }
}

