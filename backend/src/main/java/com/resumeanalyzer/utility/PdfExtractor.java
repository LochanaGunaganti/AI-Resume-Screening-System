package com.resumeanalyzer.utility;

import com.resumeanalyzer.exception.InvalidFileException;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Component
public class PdfExtractor {

    private static final long MAX_SIZE = 20L * 1024 * 1024; // 20 MB

    public String extract(MultipartFile file) {
        validateFile(file);
        try (PDDocument doc = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(doc);
            if (text == null || text.isBlank()) {
                throw new InvalidFileException("Could not extract text from the PDF. It may be scanned or image-based.");
            }
            return text.trim();
        } catch (InvalidFileException e) {
            throw e;
        } catch (IOException e) {
            throw new InvalidFileException("Failed to read the PDF file: " + e.getMessage());
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("No file was provided.");
        }
        if (file.getSize() > MAX_SIZE) {
            throw new InvalidFileException("File size exceeds the 20 MB limit.");
        }
        String originalName = file.getOriginalFilename();
        String contentType = file.getContentType();
        boolean isPdf = (originalName != null && originalName.toLowerCase().endsWith(".pdf"))
                || "application/pdf".equalsIgnoreCase(contentType);
        if (!isPdf) {
            throw new InvalidFileException("Only PDF files are accepted. Received: " + originalName);
        }
    }
}
