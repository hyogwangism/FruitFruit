package com.shop.fruitfruit;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.shop.fruitfruit.admin.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Controller;
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
    private final AdminService adminService;

    /**
     * @author 황호준
     * 메인페이지
     */

    @RequestMapping("")
    public String mainPage(Model model, @RequestParam(defaultValue = "1") int pageNum, @RequestParam(defaultValue = "9") int pageSize) {
        PageHelper.startPage(pageNum, pageSize);

        List<HashMap<String, Object>> productList = adminService.selectAllProductWithImage();
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
        List<HashMap<String, Object>> productList = adminService.selectProductBySortSearchField(paramMap);
        PageInfo<HashMap<String, Object>> pageInfo = new PageInfo<>(productList);

        log.info("프로덕트리스트:" + productList);
        log.info("페이지인포:" + pageInfo);
        return pageInfo;
    }

    @RequestMapping("user/{pageName}")
    public String goSubPage(@PathVariable String pageName, @RequestParam(required = false) String userName, Model model, HttpServletRequest request){
            model.addAttribute("username", userName);
            return "user/" + pageName;
    }



}
