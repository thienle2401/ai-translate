import fs from 'fs';

const dict = {
  "1": "Bắt đầu địa chỉ Placeholder - KHÔNG CHỈNH SỬA",
  "2": "[Tên người nhận]",
  "3": "[Dòng địa chỉ]",
  "4": "[Thị trấn/Thành phố]",
  "5": "[Quận]",
  "6": "[Quốc gia]",
  "7": "[Mã bưu điện] [Quận]",
  "8": "Địa chỉ cuối - KHÔNG CHỈNH",
  "9": "Bệnh viện Nhi Evelina London",
  "10": "Đường Westminster Bridge",
  "11": "London",
  "12": "SE1 7EH",
  "13": "Ngày hẹn: Wednesday 5 August 2026",
  "14": "In ngày: 5 August 2026",
  "15": "Thông tin về Bệnh nhân",
  "16": "Name: Nguyen, Thi Linh",
  "17": "DOB: 19/8/1982 ",
  "18": "NHS No: 735 723 4886 Hospital No: 40117002",
  "19": "Địa chỉ: 25 Glenside Avenue CANTERBURY CT1 1DB",
  "20": "Phone: 07869 696912",
  "21": "Dept: Evelina Paediatric Palliative Care",
  "22": "SĐT bộ phận: 020 7188 7188 x53278",
  "23": "Email bộ phận: gstt.paediatricpalliative@nhs.net",
  "24": "Seen / Reviewed by: Diana Freitas",
  "25": "Thông tin về Bác sỹ đa khoa",
  "26": "PHÒNG KHÁM Y TẾ NORTHGATE",
  "27": "1 NORTHGATE",
  "28": "CANTERBURY",
  "29": "KENT",
  "30": "CT1 1WL",
  "31": "Người nhận Chính:",
  "32": "Bà Thi Linh NGUYEN",
  "33": "Thông qua MyChart",
  "34": "Kính gửi",
  "35": "Thi Linh,",
  "36": "Tôi, CNS Diana Freitas, thuộc đội ngũ Chăm sóc giảm nhẹ nhi khoa, rất vui được gặp bạn vào ngày 5 tháng 8 năm 2026, cùng với bác sĩ tim mạch thai nhi, Bác sĩ Vigneswaran và CNS Daifenir de la Cruz.",
  "37": "Mục đích của buổi gặp mặt này là giải thích về các dịch vụ của chúng tôi và cách đội ngũ có thể hỗ trợ bạn và bé gái của bạn, dựa trên chẩn đoán tiền sinh của bé về hội chứng Trisomy 18 và bệnh tim bẩm sinh.",
  "38": "Chúng tôi đã thảo luận về dịch vụ chăm sóc giảm nhẹ nhi khoa tại bệnh viện Evelina và cách đội ngũ của chúng tôi có thể hỗ trợ bạn.",
  "39": "Chúng tôi là một đội ngũ chuyên gia bao gồm các bác sĩ chuyên khoa, Chuyên gia Điều dưỡng Lâm sàng (CNS) và các bác sĩ nội trú.",
  "40": "Chúng tôi hướng đến việc hỗ trợ trẻ em với các tình trạng giới hạn cuộc sống và gia đình của chúng, bất kể họ được chăm sóc ở đâu – trong bệnh viện và trong cộng đồng.",
  "41": "Chúng tôi làm việc chặt chẽ cùng đội Tim mạch Nhi khoa GSTT và đội Sơ sinh của Bệnh viện William Harvey.",
  "42": "Chúng tôi có ba vai trò chính:",
  "43": "Kế hoạch chăm sóc nâng cao – hỗ trợ bạn trong việc đưa ra quyết định cho bé gái của bạn, hiểu mục tiêu chăm sóc của bạn là gì và cách đạt được chúng.",
  "44": "Quản lý triệu chứng – Kết hợp với kế hoạch chăm sóc trước, chúng tôi có thể cung cấp một kế hoạch quản lý triệu chứng để đảm bảo bé gái của bạn cảm thấy thoải mái nhất có thể bằng cách quản lý bất kỳ triệu chứng gây khó chịu nào.",
  "45": "Chăm sóc cuối đời – chúng tôi đã thảo luận rằng chúng tôi không biết con gái của bạn sẽ sống được bao lâu, và chúng tôi cũng sẽ cung cấp hỗ trợ khi cô bé gần đến giai đoạn cuối đời.",
  "46": "Thi, bạn đã chia sẻ rằng bạn sống cùng chồng và có 5 người con.",
  "47": "Bạn đã ở Anh được 2 năm, nhưng vẫn chưa có giấy phép lao động.",
  "48": "Chúng tôi đã thảo luận về việc giới thiệu tới Demelza.",
  "49": "Các trung tâm chăm sóc giảm nhẹ trẻ em là các cơ sở dành cho trẻ em có bệnh phức tạp và thời gian sống hạn chế, được nhân viên y tá chăm sóc, với sự hỗ trợ từ bác sĩ gia đình địa phương và đội ngũ chuyên gia của chúng tôi.",
  "50": "Đây là một nguồn hỗ trợ tuyệt vời cho cả gia đình.",
  "51": "Bạn Thi đã đồng ý bằng lời cho việc giới thiệu tới Demelza.",
  "52": "Kế hoạch trước sinh là sinh tại Bệnh viện William Harvey.",
  "53": "Tùy thuộc vào tình trạng của bé gái sau khi sinh, nếu bé ổn định, đội ngũ địa phương có thể thực hiện một đánh giá và siêu âm tim.",
  "54": "Chúng tôi sẽ phối hợp với Bệnh viện William Harvey để gặp bạn sau khi bé của bạn được sinh ra, nhằm thảo luận về kế hoạch chăm sóc trước và sẽ cung cấp một kế hoạch quản lý triệu chứng.",
  "55": "Như đã thỏa thuận với bạn, chúng tôi sẽ giới thiệu tới Demelza.",
  "56": "Thi, chúng tôi sẽ gửi cho bạn một tin nhắn với thông tin liên lạc của đội ngũ chúng tôi.",
  "57": "Vui lòng liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi hoặc lo ngại nào.",
  "58": "Trân trọng,",
  "59": "Được ký và ủy quyền điện tử để tránh trì hoãn",
  "60": "Diana Freitas",
  "61": "Chuyên gia điều dưỡng lâm sàng trong Chăm sóc giảm nhẹ nhi khoa",
  "62": "Bệnh viện Nhi Evelina London",
  "63": "Cc: NORTHGATE MEDICAL PRACTICE",
  "64": "1 NORTHGATE",
  "65": "CANTERBURY",
  "66": "KENT",
  "67": "CT1 1WL",
  "68": "Qua đường thư điện tử tới bác sỹ đa khoa",
  "69": "Bác sĩ Shavindra Chellen",
  "70": "Bác sĩ chuyên khoa sơ sinh - Bệnh viện William Harvey",
  "71": "(Qua email)",
  "72": "Gửi qua Bưu điện",
  "73": "Name: Nguyen, Thi Linh NHS No: 735 723 4886",
  "74": "Trang 1",
  "75": "Name: Nguyen, Thi Linh NHS No: 735 723 4886",
  "76": "Trang 1"
};

// Create simplified metadata (no tag array replacement)
const rawSegments = JSON.parse(fs.readFileSync('data/extracted_all_76.json', 'utf8'));
const metadata = {};
rawSegments.forEach(s => {
  metadata[s.id.toString()] = {
    id: s.id.toString(),
    sourceText: s.sourceText,
    sourceHTML: s.sourceHTML
  };
});

fs.writeFileSync('data/translations_all_76.json', JSON.stringify(dict, null, 2), 'utf8');
fs.writeFileSync('data/source_segments_all_76.json', JSON.stringify(metadata, null, 2), 'utf8');

console.log('Prepared text-only dict and metadata.');
