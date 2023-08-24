package com.shop.fruitfruit.main;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.shop.fruitfruit.admin.AdminService;
import com.shop.fruitfruit.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
@Log4j2
public class MainController {
    private final MainService mainService;
    private final UserService userService;
    private final AdminService adminService;

    /**
     * @author 황호준
     * 메인페이지
     */

    @RequestMapping("")
    public String mainPage(Model model, HttpSession session, @RequestParam(defaultValue = "1") int startPage, @RequestParam(defaultValue = "9") int pageSize) {
        HashMap<String, Object> paramMap = new HashMap<>();
        paramMap.put("startPage", startPage);
        paramMap.put("pageSize", pageSize);

        if (session.getAttribute("sessionId") == null) {
            List<HashMap<String, Object>> productList = mainService.selectAllProductInfo(paramMap);
            PageInfo<HashMap<String, Object>> pageInfo = new PageInfo<>(productList);
            model.addAttribute("pageInfo", pageInfo);
        } else if (session.getAttribute("sessionId") != null) {
            paramMap.put("id", session.getAttribute("sessionId").toString());

            paramMap.putAll(userService.selectUser(paramMap));

            List<HashMap<String, Object>> productList = mainService.selectAllProductInfo(paramMap);
            log.info("메인 프리스트:" + productList);

//            List<HashMap<String, Object>> likeList = mainService.selectProductLikeListByUserId(paramMap);
//            log.info("메인 라이크리스트:" + productList);
////
//            // productList의 LIKE_ID 값을 Set으로 변환
//            Set<Object> productLikeIds = productList.stream()
//                    .map(like -> like.get("LIKE_ID"))
//                    .collect(Collectors.toSet());
//
//            // likeList의 LIKE_ID 값을 Set으로 변환
//            Set<Object> userLikeIds = likeList.stream()
//                    .map(like -> like.get("LIKE_ID"))
//                    .collect(Collectors.toSet());
//
//            // 두 Set 간의 교집합을 확인하여 공통된 LIKE_ID 값이 있는지 여부를 결정
//            boolean hasCommonLikes = !Collections.disjoint(productLikeIds, userLikeIds);

            PageInfo<HashMap<String, Object>> pageInfo = new PageInfo<>(productList);

            model.addAttribute("pageInfo", pageInfo);
            model.addAttribute("sessionId", session.getAttribute("sessionId").toString());
//            model.addAttribute("hasCommonLikes", hasCommonLikes);

            log.info("첫 페이지인뽕:" + pageInfo);
        }

        return "index";
    }

    @RequestMapping("/mainPageAxios")
    @ResponseBody
    public HashMap<String,Object> productAxios(HttpSession session, @RequestBody HashMap<String, Object> paramMap) {

        log.info("솔트확인:"+paramMap);

        if (session.getAttribute("sessionId") == null) {
            List<HashMap<String, Object>> productList = mainService.selectProductBySortSearchField(paramMap);
            PageInfo<HashMap<String, Object>> pageInfo = new PageInfo<>(productList);
            HashMap<String, Object> axiosMap = new HashMap<>();
            axiosMap.put("pageInfo", pageInfo);
            return axiosMap;
        } else if (session.getAttribute("sessionId") != null) {
            paramMap.put("id", session.getAttribute("sessionId").toString());

            paramMap.putAll(userService.selectUser(paramMap));

            List<HashMap<String, Object>> productList = mainService.selectProductBySortSearchField(paramMap);
            log.info("프리스트:" + productList);

//            List<HashMap<String, Object>> likeList = mainService.selectProductLikeListByUserId(paramMap);
//            log.info("라이크리스트:" + productList);
//
//            // productList의 LIKE_ID 값을 Set으로 변환
//            Set<Object> productLikeIds = productList.stream()
//                    .map(like -> like.get("LIKE_ID"))
//                    .collect(Collectors.toSet());
//
//            // likeList의 LIKE_ID 값을 Set으로 변환
//            Set<Object> userLikeIds = likeList.stream()
//                    .map(like -> like.get("LIKE_ID"))
//                    .collect(Collectors.toSet());
//
//            // 두 Set 간의 교집합을 확인하여 공통된 LIKE_ID 값이 있는지 여부를 결정
//            boolean hasCommonLikes = !Collections.disjoint(productLikeIds, userLikeIds);

            PageInfo<HashMap<String, Object>> pageInfo = new PageInfo<>(productList);

            HashMap<String, Object> axiosMap = new HashMap<>();
            axiosMap.put("pageInfo", pageInfo);
            axiosMap.put("sessionId", session.getAttribute("sessionId").toString());

            return axiosMap;
        }
        return null;
    }

    @RequestMapping("/productLikeAxios")
    @ResponseBody
    @Transactional
    public HashMap<String, Object> productLikeAxios(HttpSession session, @RequestBody HashMap<String, Object> paramMap) {
        log.info("첫파람맵:" + paramMap);

        Boolean isLiked = false;

        //로그인이 되어있는 상태일때
        if (session.getAttribute("sessionId") != null) {
            String id = (String) session.getAttribute("sessionId");
            paramMap.put("id", id);

            //sessionId 기준으로 유저정보 select
            paramMap.putAll(userService.selectUser(paramMap));
            log.info("유저정보 포함 파람맵:" + paramMap);

            //sessionId, productId 기준으로 찜목록 select
            if (mainService.selectProductLikeByProductId(paramMap) == null) {
                log.info("유저프덕맵:" + paramMap);

                //찜이 되어있지 않은 상태니까 찜하는 메서드 실행
                mainService.insertProductLike(paramMap);

                //찜이 되었으니 다시 sessionId, productId 기준으로 select
                paramMap.putAll(mainService.selectProductLikeByProductId(paramMap));
                log.info("아쇽파람맵1:" + paramMap);

                if (paramMap.get("productLikeId").toString().equals(paramMap.get("PRODUCT_ID").toString())) {
                    isLiked = true;
                }

                paramMap.put("isLiked", isLiked);

                return paramMap;

                //sessionId, productId 기준으로 찜목록이 있을때
            } else if (mainService.selectProductLikeByProductId(paramMap) != null) {

                //sessionId, productId 기준으로 찜목록 불러와서 Map에 put
                paramMap.putAll(mainService.selectProductLikeByProductId(paramMap));

                //불러온 찜목록에서 LIKE_ID기준으로 찜 삭제
                mainService.deleteProductLike(paramMap);

                HashMap<String, Object> likeMap = mainService.selectProductLikeByProductId(paramMap);
                if (likeMap == null) {
                    isLiked = false;
                    paramMap.put("isLiked", isLiked);
                }
                log.info("아쇽파람맵2:" + paramMap);
                return paramMap;
            }

            //로그인 되어있지 않은 상태일때
        } else if (session.getAttribute("sessionId") == null) {
            //sessionId가 없으면 return할 Map을 비우기 => 로그인되지 않았을때는 찜을 할 수 없어야 하기 때문
            paramMap.clear();
            log.info("제거된 파람맵:" + paramMap);
            return paramMap;
        }

        return null;
    }


//    @RequestMapping("user/{pageName}")
//    public String goSubPage(@PathVariable String pageName, @RequestParam(required = false) String userName, Model model, HttpServletRequest request){
//            model.addAttribute("username", userName);
//            return "user/" + pageName;
//    }

}
