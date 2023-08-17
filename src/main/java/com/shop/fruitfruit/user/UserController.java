package com.shop.fruitfruit.user;

import lombok.RequiredArgsConstructor;
import org.apache.ibatis.annotations.Param;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@RequestMapping("user")
public class UserController {
    private final UserService userService;

    private final static String sessionId = "sessionId";



    /**
     * @author 황호준
     *
     * 회원가입
     *
     * @param {string} 테이블 이름 user
     * @param
     * {
     *   HashMap<String, Object> paramMap => Input에 입력된 회원정보 저장
     *   JoinMethod =>
     *    1. 사용자 입력비번 암호화
     *    2. 암호화 비번 HashMap에 추가
     *    3. 회원정보 Insert
     *    4. 회원 ID기준 정보 Select
     *    5. 가져온 정보중 USER_ID_NO를 HashMap에 추가
     *    6. 회원기준 약관동의 여부 Insert
     * }
     */
    @RequestMapping("/join_ok")
    @ResponseBody
    public String Join_ok(Model model, @RequestBody HashMap<String, Object> paramMap) throws Exception {

        userService.JoinMethod(paramMap);
        model.addAttribute("errorMessage", "회원정보 가입 성공.");

        return paramMap.get("id").toString();
    }

    /**
     * @author 황호준
     * 아이디 중복체크
     */
    @RequestMapping("/idChk")
    @ResponseBody
    public int idChk(@RequestBody HashMap<String, Object> paramMap) throws Exception {
        int re = 1;
        String id = paramMap.get("id").toString();
        // userService.loginUserChk(id)에서 반환된 결과를 먼저 검증
        HashMap<String, Object> userMap = userService.loginUserChk(id);

        if (userMap != null && id.equals(userMap.get("USER_EMAIL").toString())) {
            return re;
        } else {
            re = -1;
            return re;
        }
    }

    /**
     * @author 황호준
     * 닉네임 중복체크
     */
    @RequestMapping("/nameChk")
    @ResponseBody
    public int nameChk(Model model, @RequestBody HashMap<String, Object> paramMap) throws Exception {
        String name = paramMap.get("name").toString();
        HashMap<String, Object> userMap = userService.joinNameChk(name);

        if (userMap != null && name.equals(userMap.get("USER_NAME").toString())) {
            return 1;
        } else {
            return -1;
        }
    }

    /**
     * @author 황호준
     * DB에 저장되어진 회원 데이터와 비교해서 로그인
     */
    @RequestMapping("/login_ok")
    public String Login_ok(Model model, HttpServletRequest request, @RequestParam("id") String id, @RequestParam("pw") String pw){
        if(id.equals(userService.loginUserChk(id).get("USER_EMAIL").toString()) && BCrypt.checkpw(pw, userService.loginUserChk(id).get("USER_PWD").toString())){
            HttpSession session = request.getSession();
            session.setAttribute(sessionId, id);
            return "redirect:/";
        } else {
            model.addAttribute("errorMessage", "아이디 또는 비밀번호가 틀렸습니다.");

            return "/user/login";
        }
    }

    /**
     * @author 황호준
     * 로그아웃.
     */
    @RequestMapping("/logout")
    public String logout(HttpServletRequest request){
        // 현재 세션 가져오기 (false: 세션이 없으면 null 반환)
        HttpSession session = request.getSession(false);
        if (session != null) {
            // 세션 무효화 (세션 종료)
            session.invalidate();
        }

        return "redirect:/";
    }

    /**
     * @author 황호준
     * 이메일 아이디 검색
     */
    @RequestMapping("/findPwd")
    @ResponseBody
    public int findPwd(@RequestBody HashMap<String, Object> paramMap){
        String id = paramMap.get("id").toString();
        HashMap<String, Object> ChkMap = userService.loginUserChk(id);

        if(ChkMap != null && id.equals(ChkMap.get("USER_EMAIL").toString())){
            return 1;
        } else {
            return -1;
        }
    }

    /**
     * @author 황호준
     * 비밀번호 변경
     */
    @RequestMapping("/changePwd")
    @ResponseBody
    public int changePwd(@RequestBody HashMap<String, Object> paramMap){
        String newpw = paramMap.get("newpw").toString();
        String id = paramMap.get("id").toString();
        HashMap<String, Object> ChkMap = userService.loginUserChk(id);

        if(ChkMap != null && BCrypt.checkpw(newpw, ChkMap.get("USER_PWD").toString())){
            return -1;
        } else {
            //새 비밀번호 업데이트
            HashMap<String, Object> updateMap = new HashMap<>();
            updateMap.put("id", id);
            updateMap.put("newpw", newpw);
            userService.updatePw(updateMap);
            return 1;
        }
    }


}
