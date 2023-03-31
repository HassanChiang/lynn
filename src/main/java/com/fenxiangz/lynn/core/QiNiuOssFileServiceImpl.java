package com.fenxiangz.lynn.core;

import cn.hutool.core.util.URLUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.fenxiangz.lynn.conf.properties.OssProperties;
import com.qiniu.common.QiniuException;
import com.qiniu.http.Response;
import com.qiniu.storage.Configuration;
import com.qiniu.storage.Region;
import com.qiniu.storage.UploadManager;
import com.qiniu.util.Auth;
import com.fenxiangz.lynn.core.OssFileService;
import com.fenxiangz.lynn.exception.UploadOssException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.InitializingBean;

import java.io.File;
import java.io.InputStream;

@Slf4j
public class QiNiuOssFileServiceImpl implements OssFileService, InitializingBean {
    private String accessKey;
    private String secretKey;
    private String space;
    private String domain;
    private Auth auth;

    public QiNiuOssFileServiceImpl(OssProperties properties) {
        this.accessKey = properties.getAccessKey();
        this.secretKey = properties.getSecretKey();
        this.space = properties.getSpace();
        this.domain = properties.getDomain();
    }

    @Override
    public String upload(File file, String filename) {
        return this.upload(file, filename, space);
    }

    @Override
    public String upload(InputStream is, String filename, String space) {
        UploadManager uploadManager = new UploadManager(new Configuration(Region.autoRegion()));
        String uploadToken = getUploadToken(space);
        String key;
        try {
            Response response = uploadManager.put(is, filename, uploadToken, null, null);
            JSONObject result = JSONUtil.parseObj(response.bodyString());
            key = result.getStr("key");
        } catch (QiniuException e) {
            log.error("上传文件到七牛失败, 响应内容为:[{}]", e.response, e);
            throw new UploadOssException("文件上传失败");
        }
        return getFileUrl(key);
    }

    private String getFileUrl(String key) {
        return URLUtil.completeUrl(domain, key);
    }

    private String getUploadToken(String bucket) {
        return auth.uploadToken(bucket);
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        auth = Auth.create(accessKey, secretKey);
    }
}
