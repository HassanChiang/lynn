package com.fenxiangz.lynn.utils;

import lombok.NonNull;
import lombok.experimental.UtilityClass;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@UtilityClass
public class FileUtils {
    public Path createTempFile(@NonNull String filename) throws IOException {
        return Files.createTempDirectory("temp_file").resolve(filename);
    }
}
