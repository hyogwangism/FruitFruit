package com.shop.fruitfruit.main;

import com.github.pagehelper.PageHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class MainService implements MainMapper{
    private final MainMapper mainMapper;

    /**
     * @author 황호준
     * 전체 상품 목록 조회
     */
    @Override
    public List<HashMap<String, Object>> selectAllProductInfo(HashMap<String, Object> paramMap) {
        PageHelper.startPage((Integer) paramMap.get("startPage"), (Integer) paramMap.get("pageSize"));
        return mainMapper.selectAllProductInfo(paramMap);
    }

    /**
     * @author 황호준
     * 조건에 따른 상품목록 조회
     */
    @Override
    public List<HashMap<String, Object>> selectProductBySortSearchField(HashMap<String, Object> paramMap) {
        int startPage = Integer.parseInt(paramMap.get("startPage").toString());
        int pageSize = Integer.parseInt(paramMap.get("pageSize").toString());
        PageHelper.startPage(startPage, pageSize);
        return mainMapper.selectProductBySortSearchField(paramMap);
    }

    /**
     * @author 황호준
     * 상품 찜 insert
     */
    @Override
    public void insertProductLike(HashMap<String, Object> paramMap) {
        mainMapper.insertProductLike(paramMap);
    }

    /**
     * @author 황호준
     * 해당상품 찜 by 로그인된 아이디
     */
    @Override
    public HashMap<String, Object> selectProductLikeByProductId(HashMap<String, Object> paramMap) {
        return mainMapper.selectProductLikeByProductId(paramMap);
    }

    /**
     * @author 황호준
     * 상품 찜 delete
     */
    @Override
    public void deleteProductLike(HashMap<String, Object> paramMap) {
        mainMapper.deleteProductLike(paramMap);
    }

    /**
     * @author 황호준
     * 로그인된 아이디 찜 목록
     */
    @Override
    public List<HashMap<String, Object>> selectProductLikeListByUserId(HashMap<String, Object> paramMap) {
        return mainMapper.selectProductLikeListByUserId(paramMap);
    }

}
