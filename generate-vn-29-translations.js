import fs from 'fs';

const sourceSegments = JSON.parse(fs.readFileSync('data/source_segments.json', 'utf8'));

const map = {
  "1": "Tầm soát Ung thư Phổi",
  "2": "Quỹ Tín thác NHS Bệnh viện Tim và Ngực Liverpool",
  "3": "Thomas Drive",
  "4": "Liverpool",
  "5": "L14 3PE",
  "6": "0151 254 303",
  "7": "131 Earle Road",
  "8": "Liverpool",
  "9": "Merseyside",
  "10": "L7 6HD",
  "11": "03-08-2026",
  "12": "Số NHS: 649 541 5257",
  "13": ["Ngày sinh: ", "26-06-1965 "],
  "14": "Kính gửi Bác sĩ,",
  "15": "V/v: Tầm soát Ung thư Phổi – Nhận lại vào Dịch vụ Tầm soát Ung thư Phổi",
  "16": "Bệnh nhân của bác sĩ đã được Chương trình Tầm soát Ung thư Phổi chuyển đến Dịch vụ Bóng mờ Phổi và hiện đã được xuất viện.",
  "17": "Sau đó, ông Nguyễn Tấn đã được chuyển trở lại Chương trình Tầm soát Ung thư Phổi theo yêu cầu của bác sĩ tư vấn và sẽ cần tiếp tục theo dõi với Chương trình Tầm soát Ung thư Phổi.",
  "18": "Chụp CT liều thấp theo dõi",
  "19": "Xử lý nốt mờ: Đội ngũ Tầm soát Ung thư Phổi đã lập giấy chuyển viện để chụp lại CT lồng ngực vào tháng 10 năm 2026.",
  "20": "Lịch hẹn cho việc này sẽ được sắp xếp vào thời gian thích hợp.",
  "21": "Có thể xem toàn bộ nội dung khám tư vấn từ hồ sơ dùng chung EMIS.",
  "22": "Trân trọng,",
  "23": "ĐỘI NGŨ TẦM SOÁT UNG THƯ PHỔI",
  "24": "Chỉ gửi bản sao đến",
  "25": "Đồng gửi",
  "26": "Ông Nguyễn Tấn Phước",
  "27": "16A Derby Lane",
  "28": "Liverpool",
  "29": "L13 3DL"
};

const translations = {};
for (const [id, data] of Object.entries(sourceSegments)) {
  if (map[id]) {
    translations[id] = map[id];
  } else {
    translations[id] = data.sourceText;
  }
}

fs.writeFileSync('data/translations.json', JSON.stringify(translations, null, 2), 'utf8');
console.log(`Generated data/translations.json for ${Object.keys(translations).length} segments.`);
