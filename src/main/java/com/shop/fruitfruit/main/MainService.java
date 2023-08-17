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

    @Override
    public List<HashMap<String, Object>> selectAllProductInfo() {

        return mainMapper.selectAllProductInfo();
    }

    @Override
    public List<HashMap<String, Object>> selectProductBySortSearchField(HashMap<String, Object> paramMap) {
        int startPage = Integer.parseInt(paramMap.get("startPage").toString());
        int pageSize = Integer.parseInt(paramMap.get("pageSize").toString());
        PageHelper.startPage(startPage, pageSize);
        return mainMapper.selectProductBySortSearchField(paramMap);
    }

    @Override
    public void insertProductLike(HashMap<String, Object> paramMap) {
        mainMapper.insertProductLike(paramMap);
    }

    @Override
    public HashMap<String, Object> selectProductLikeByProductId(HashMap<String, Object> paramMap) {
        return mainMapper.selectProductLikeByProductId(paramMap);
    }

    @Override
    public void deleteProductLike(HashMap<String, Object> paramMap) {
        mainMapper.deleteProductLike(paramMap);
    }

}
