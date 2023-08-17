package com.shop.fruitfruit.main;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.shop.fruitfruit.admin.AdminService;
import com.shop.fruitfruit.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;

@Controller
@RequiredArgsConstructor
@Log4j2
public class MainController {
    private final MainService mainService;
    private final UserService userService;

    /**
     * @author 황호준
     * 메인페이지
     */

    @RequestMapping("")
    public String mainPage(Model model, @RequestParam(defaultValue = "1") int pageNum, @RequestParam(defaultValue = "9") int pageSize) {
        PageHelper.startPage(pageNum, pageSize);

        List<HashMap<String, Object>> productList = mainService.selectAllProductInfo();
        log.info("프리스트:"+productList);
        PageInfo<HashMap<String, Object>> pageInfo = new PageInfo<>(productList);

        model.addAttribute("pageInfo", pageInfo);
        log.info("첫 페이지인뽕:" + pageInfo);
        return "index";
    }

    @RequestMapping("/mainPageAxios")
    @ResponseBody
    public PageInfo<HashMap<String, Object>> productAxios(@RequestBody HashMap<String, Object> paramMap){
        log.info("아쇽스맵:"+paramMap);
        List<HashMap<String, Object>> productList = mainService.selectProductBySortSearchField(paramMap);
        PageInfo<HashMap<String, Object>> pageInfo = new PageInfo<>(productList);

        log.info("프로덕트리스트:" + productList);
        log.info("페이지인포:" + pageInfo);
        return pageInfo;
    }

    @RequestMapping("/productLikeAxios")
    @ResponseBody
    @Transactional
    public int productLikeAxios(HttpSession session, Model model, @RequestBody HashMap<String, Object> paramMap){
        log.info("첫파람맵:"+paramMap);
        if(session.getAttribute("sessionId")!=null){
            String id = (String) session.getAttribute("sessionId");
            paramMap.put("id", id);
            paramMap.putAll(userService.selectUser(paramMap));
            if(mainService.selectProductLikeByProductId(paramMap) == null){
             log.info("유저프덕맵:"+paramMap);
             mainService.insertProductLike(paramMap);
             return 1;
         } else if(mainService.selectProductLikeByProductId(paramMap) != null) {
             paramMap.putAll(mainService.selectProductLikeByProductId(paramMap));
             mainService.deleteProductLike(paramMap);
             return 2;
         }

        } else if(session.getAttribute("sessionId")==null) {

            return -1;
        }

        return 3;
    }

    @RequestMapping("user/{pageName}")
    public String goSubPage(@PathVariable String pageName, @RequestParam(required = false) String userName, Model model, HttpServletRequest request){
            model.addAttribute("username", userName);
            return "user/" + pageName;
    }



}
