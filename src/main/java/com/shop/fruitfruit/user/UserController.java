package com.shop.fruitproject.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("user")
public class UserController {
    private final UserService userService;

    @RequestMapping("testSelect")
    @ResponseBody
    public List<HashMap<String, Object>> testSelect(){

        return userService.testSelect();
    }

    @RequestMapping("testGet")
    public String testGet(Model model){
        model.addAttribute("paramim", userService.testSelect());
        return "/modal/get";
    }
}
