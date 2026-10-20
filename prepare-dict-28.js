import fs from 'fs';

const translations = {
  "1": "Thân gửi Ngọc,",
  "2": ["Ngoc NGUYEN", "Ngày sinh 01/01/2009"],
  "3": ["2a, Cecil Street", "Số hồ sơ bệnh viện: AH2119014"],
  "4": ["Liverpool L15 1HR", "Số NHS: 735 997 6111"],
  "5": "Tôi viết thư này gửi bạn để tổng hợp lại buổi hẹn gần nhất của chúng ta, diễn ra vào ngày 31 tháng 7 năm 2026.",
  "6": "Kể từ buổi gặp trước, bạn đã tiếp tục dành thời gian vui vẻ bên bạn bè trong kỳ nghỉ hè.",
  "7": "Tôi ghi nhận khoảng thời gian này đã diễn ra rất tích cực so với những khó khăn mà bạn gặp phải khi nghỉ học trong kỳ nghỉ Lễ Phục sinh.",
  "8": "Tuy nhiên, bạn cũng cho tôi biết rằng dạo gần đây việc đi vào giấc ngủ trở nên khó khăn hơn đối với bạn.",
  "9": "Tôi băn khoăn liệu điều này có phải do những cơn ác mộng hay những suy nghĩ trăn trở từ quá khứ gây ra hay không.",
  "10": "Bạn đã cho tôi biết rằng bạn ít nghĩ về quá khứ hơn và suy nghĩ nhiều hơn về tương lai.",
  "11": "Bạn đã chia sẻ về những nỗi lo lắng khi bước sang tuổi 18 vào năm tới cũng như những kỳ vọng và trách nhiệm gia tăng đi kèm với điều đó.",
  "12": "Bạn đã đưa ra ví dụ về việc phải tự mình đặt lịch hẹn là điều khiến bạn cảm thấy hồi hộp, lo lắng.",
  "13": "Ngọc à, tôi nghĩ đây là cảm xúc rất đỗi bình thường và dễ hiểu khi bạn sắp tiến tới cột mốc lớn này.",
  "14": "Hãy nhớ rằng bạn luôn có sự hỗ trợ từ những người như Leah để giúp bạn tiếp tục xây dựng sự tự tin với các kỹ năng sống này.",
  "15": "Bạn cũng cho tôi biết rằng bạn đã kết thúc công việc với nhân viên xã hội của mình, điều mà bạn cảm thấy buồn cũng là lẽ tự nhiên.",
  "16": "Bạn nói rằng bạn sẽ gặp nhân viên xã hội mới sau buổi tham vấn của chúng ta và cảm thấy hơi lo lắng về điều này.",
  "17": "Chúng ta đã thảo luận về những kỳ vọng của bạn về nhân viên xã hội mới.",
  "18": "Bạn nói rằng bạn hy vọng họ là người dễ tính và tốt bụng.",
  "19": "Tôi rất mong được nghe về kết quả cuộc gặp này trong buổi tham vấn tiếp theo của chúng ta.",
  "20": "Chúng ta đã nhìn lại thời gian bạn tham gia các buổi trị liệu tâm lý vừa qua và cân nhắc xem liệu bạn có muốn trò chuyện về tổn thương tâm lý trong các buổi tham vấn để giúp giảm bớt những trải nghiệm khó khăn như ký ức ùa về, suy nghĩ xâm nhập và ác mộng hay không.",
  "21": "Chúng ta đã xem xét hai lựa chọn khả thi cho chặng đường tiếp theo:",
  "22": ["Bắt đầu ", "các buổi trị liệu tập trung vào tổn thương tâm lý hàng tuần", ", nơi chúng ta sẽ cùng nhau trò chuyện về quá khứ của bạn để giúp bạn phục hồi sau những ảnh hưởng của nó"],
  "23": ["Bạn có thể quyết định rằng trị liệu tập trung vào tổn thương tâm lý là không cần thiết và trong trường hợp này, chúng ta sẽ gặp nhau ", "hàng tháng để kiểm tra sức khỏe cảm xúc của bạn"],
  "24": "Trong buổi gặp gần nhất, bạn chưa chắc chắn lựa chọn nào là quyết định tốt nhất cho mình.",
  "25": "Chúng ta đã đồng ý sẽ quay lại thảo luận vấn đề này trong buổi gặp tới để bạn có thời gian suy nghĩ kỹ lưỡng.",
  "26": "Tôi rất mong được gặp lại bạn trong buổi gặp tiếp theo vào Thứ Sáu ngày 14 tháng 8 lúc 11 giờ 30 phút sáng tại Công viên Sáng tạo Liverpool (Liverpool Innovation Park).",
  "27": "Chúc bạn mọi điều tốt đẹp nhất,",
  "28": "Alex",
  "29": "Bác sĩ Alexandra Scott-Heyes",
  "30": "Nhà tâm lý học lâm sàng"
};

fs.writeFileSync('data/translations.json', JSON.stringify(translations, null, 2), 'utf8');
console.log('Saved data/translations.json with', Object.keys(translations).length, 'segments.');
