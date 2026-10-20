import fs from 'fs';

const dict = {
  "1": "Sarah Smith",
  "2": "Giám đốc Điều hành",
  "3": "Sharon Cooper",
  "4": "Giám đốc Dịch vụ Trẻ em",
  "5": "Hội đồng Quận Warrington",
  "6": "Tòa thị chính",
  "7": "Sankey Street",
  "8": "Warrington",
  "9": "WA1 1UH",
  "10": "Sarah Smith",
  "11": "Giám đốc Điều hành",
  "12": "Sharon Cooper",
  "13": "Giám đốc Dịch vụ Trẻ em",
  "14": "Hội đồng Quận Warrington",
  "15": "Tòa thị chính",
  "16": "Sankey Street",
  "17": "Warrington",
  "18": "WA1 1UH",
  "19": ":31202 bbyron@warrington.gov.uk",
  "20": ":31202 bbyron@warrington.gov.uk",
  "21": "Ngày: Tháng 8 năm 2026",
  "22": "Thân gửi Quan,",
  "23": "Đã đến lúc tôi xem xét lại kế hoạch chăm sóc của em, và Evelyn đã cho tôi biết rằng Neta sẽ được mời, trong khi nhà trường, y tá trường học và Hashim sẽ chỉ được yêu cầu nộp báo cáo bằng văn bản.",
  "24": "Nếu đây không phải là những gì em muốn, xin vui lòng cho tôi biết.",
  "25": "Lý do chúng tôi thực hiện buổi đánh giá này là để cùng em xem xét lại kế hoạch chăm sóc và đảm bảo người lớn đang làm đúng trách nhiệm của họ, cũng như kế hoạch chăm sóc vẫn phù hợp với em.",
  "26": "Tôi muốn em được hạnh phúc nhất có thể và được chăm sóc chu đáo.",
  "27": "Nhiệm vụ của tôi là đảm bảo tiếng nói của em được lắng nghe, và buổi đánh giá là cơ hội để em hỏi người lớn về những việc họ đang làm cho em.",
  "28": "Có rất nhiều cách em có thể cho tôi biết suy nghĩ của mình về kế hoạch chăm sóc và điều gì là quan trọng đối với em:",
  "29": "Gửi báo cáo hoặc bài thuyết trình",
  "30": "Gửi một số hình ảnh",
  "31": "Hoàn thành và gửi lại mẫu đóng góp ý kiến đính kèm",
  "32": "Yêu cầu trao đổi với tôi trước buổi đánh giá",
  "33": "Tham dự buổi đánh giá của em",
  "34": "Tự chủ trì buổi đánh giá của mình",
  "35": "Nếu em truy cập trang web “All About Us” của Warrington, em có thể tìm hiểu thêm thông tin về các buổi đánh giá.",
  "36": "Trang web cũng có nhiều gợi ý hay giúp em bày tỏ những điều mình muốn nói.",
  "37": "Em thậm chí có thể tự tạo báo cáo của riêng mình trên đó: https://allaboutus.warrington.gov.uk/",
  "38": "Dù chúng tôi có thể thảo luận về em trong buổi đánh giá, chúng tôi làm điều này nhằm đảm bảo người lớn đang thực hiện đúng nhiệm vụ của họ, và chúng tôi sẽ giao việc cho các người lớn hoàn thành để chắc chắn rằng kế hoạch chăm sóc vẫn đang hỗ trợ tốt cho em.",
  "39": "Các nhiệm vụ này được gọi là quyết định đánh giá, và đó là các công việc dành cho người lớn.",
  "40": "Sau buổi đánh giá, tôi sẽ viết một báo cáo và em có thể nhận một bản sao, nhưng tôi cũng sẽ viết gửi em một lá thư.",
  "41": "Tôi thường gửi bản sao báo cáo cho những người đã được mời hoặc tham khảo ý kiến tại buổi đánh giá của em.",
  "42": "Nếu em không muốn ai đó nhận được bản sao, xin vui lòng cho tôi biết.",
  "43": "Chúng tôi hy vọng em có thể tham dự và rất mong được trao đổi với em vào lúc 14:00 ngày 25 tháng 8 năm 2026 tại nhà.",
  "44": "Ellie Malone",
  "45": "ELLIE MALONE",
  "46": "Cán bộ Đánh giá Độc lập",
  "47": "Quay số trực tiếp: 01925 442781",
  "48": "Số di động: 07775 024841 – Số này chỉ nên được sử dụng trong giờ hành chính từ 9h sáng",
  "49": "đến 17h từ Thứ Hai đến Thứ Sáu và không được dùng trong trường hợp khẩn cấp",
  "50": "Email: emalone@warrington.gov.uk",
  "51": "Website: www.warringtonlscb.org",
  "52": "HÃY ĐẢM BẢO TIẾNG NÓI CỦA EM ĐƯỢC LẮNG NGHE",
  "53": "EM CÓ QUYỀN ĐƯỢC LẮNG NGHE VÀ ĐƯỢC TÔN TRỌNG NGHIÊM TÚC",
  "54": "EM CÓ THỂ ĐẾN VÀ THAM GIA NHÓM EXPRESS CỦA CHÚNG TÔI MỖI THÁNG MỘT LẦN",
  "55": "HOẶC",
  "56": "EM CÓ THỂ SỬ DỤNG LIÊN KẾT NÀY ĐỂ LIÊN HỆ TRỰC TUYẾN NGAY LẬP TỨC",
  "57": "GỬI EMAIL ĐẾN KPIERCE@WARRINGTON.GOV.UK ĐỂ BIẾT THÊM THÔNG TIN",
  "58": "CHÍNH THỨC",
  "59": "CHÍNH THỨC",
  "60": "CHÍNH THỨC",
  "61": "CHÍNH THỨC",
  "62": "CHÍNH THỨC",
  "63": "CHÍNH THỨC"
};

const rawSegments = JSON.parse(fs.readFileSync('data/extracted_all_63.json', 'utf8'));
const metadata = {};
rawSegments.forEach(s => {
  metadata[s.id.toString()] = {
    id: s.id.toString(),
    sourceText: s.sourceText,
    sourceHTML: s.sourceHTML
  };
});

fs.writeFileSync('data/translations_63.json', JSON.stringify(dict, null, 2), 'utf8');
fs.writeFileSync('data/source_segments_63.json', JSON.stringify(metadata, null, 2), 'utf8');

console.log(`Successfully generated translations_63.json and source_segments_63.json for ${Object.keys(dict).length} segments.`);
