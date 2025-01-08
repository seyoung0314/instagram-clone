// controller/RouteController.java
package com.example.instagramclone.controller.routes;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RouteController {

    @GetMapping("/")
    public String index() {
        // 나중에 로그인 후 복귀할떄 주석해제
//        return "index";
        return "auth/login";
    }

    //회원가입 페이지 열기
    // 회원가입 페이지 열기
    @GetMapping("/signup")
    public String signUp() {
        return "auth/signup";
    }
}
