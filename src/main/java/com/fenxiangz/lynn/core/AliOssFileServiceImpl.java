package com.fenxiangz.lynn.core;

import cn.hutool.core.util.URLUtil;
import com.aliyun.oss.OSSClient;
import com.fenxiangz.lynn.conf.properties.OssProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.InputStream;

@Slf4j
public class AliOssFileServiceImpl implements OssFileService, InitializingBean {
    private String accessKey;
    private String secretKey;
    private String space;
    private String domain;
    private OSSClient ossClient;

    public AliOssFileServiceImpl(OssProperties properties) {
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
        ossClient.putObject(space, filename, is);
        return getFileUrl(filename);
    }

    private String getFileUrl(String key) {
        return URLUtil.completeUrl(domain, key);
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        ossClient = new OSSClient(domain, accessKey, secretKey);
    }

}
