const locations = [
  {
    _id: "65367c9a6989f834e0a2e7a5",
    latitude: 10.76299369,
    longitude: 106.6824717,
    ward: "4",
    district: "5",
    address:
      "227 Đ. Nguyễn Văn Cừ, Phường 4, Quận 5, Thành phố Hồ Chí Minh, Vietnam",
    type: "Nhà chờ xe buýt",
    method: "Quảng cáo thương mại",
    images: [],
    accepted: true,
    created_at: "2023-10-23T14:00:58.013Z",
    updated_at: "2023-10-23T14:00:58.013Z",
    __v: 0,
  },
  {
    _id: "65367c9c6989f834e0a2e7a7",
    latitude: 10.76374731,
    longitude: 106.6825575,
    ward: "Nguyễn Cư Trinh",
    district: "1",
    address:
      "Đ. Nguyễn Văn Cừ, Phường Nguyễn Cư Trinh, Quận 1, Thành phố Hồ Chí Minh, Vietnam",
    type: "Nhà chờ xe buýt",
    method: "Quảng cáo thương mại",
    images: [],
    accepted: true,
    created_at: "2023-10-23T14:01:00.082Z",
    updated_at: "2023-10-23T14:01:00.082Z",
    __v: 0,
  },
  {
    _id: "65367cb86989f834e0a2e7a9",
    latitude: 10.75864756,
    longitude: 106.6817497,
    ward: "2",
    district: "5",
    address:
      "12, 3 Đ. Nguyễn Trãi, Phường 2, Quận 5, Thành phố Hồ Chí Minh, Vietnam",
    type: "Cây xăng",
    method: "Xã hội hóa",
    images: [],
    accepted: true,
    created_at: "2023-10-23T14:01:28.783Z",
    updated_at: "2023-10-23T14:01:28.783Z",
    __v: 0,
  },
  {
    _id: "65367cb86989f834e0a2e7ab",
    latitude: 10.76478719,
    longitude: 106.6781931,
    ward: "1",
    district: "10",
    address:
      "381-122 Đ. Trần Bình Trọng, Phường 1, Quận 10, Thành phố Hồ Chí Minh, Vietnam",
    type: "Đất tư nhân/Nhà ở riêng lẻ",
    method: "Cổ động chính trị",
    images: [],
    accepted: false,
    created_at: "2023-10-23T14:01:28.848Z",
    updated_at: "2023-10-23T14:01:28.848Z",
    __v: 0,
  },
  {
    _id: "65367cb86989f834e0a2e7ad",
    latitude: 10.76837843,
    longitude: 106.6783231,
    ward: "1",
    district: "3",
    address:
      "Lô E - chung cư Nguyễn Thiện Thuật, Phường 1, Quận 3, Thành phố Hồ Chí Minh, Vietnam",
    type: "Đất công/Công viên/Hành lang an toàn giao thông",
    method: "Quảng cáo thương mại",
    images: [],
    accepted: true,
    created_at: "2023-10-23T14:01:28.910Z",
    updated_at: "2023-10-23T14:01:28.910Z",
    __v: 0,
  },
  {
    _id: "65367cb86989f834e0a2e7af",
    latitude: 10.7732106,
    longitude: 106.6775723,
    ward: "11",
    district: "10",
    address:
      "91 Đ. 3 Tháng 2, Phường 11, Quận 10, Thành phố Hồ Chí Minh, Vietnam",
    type: "Đất tư nhân/Nhà ở riêng lẻ",
    method: "Cổ động chính trị",
    images: [],
    accepted: true,
    created_at: "2023-10-23T14:01:28.974Z",
    updated_at: "2023-10-23T14:01:28.974Z",
    __v: 0,
  },
  {
    _id: "65367cb96989f834e0a2e7b1",
    latitude: 10.75848242,
    longitude: 106.6691318,
    ward: "9",
    district: "5",
    address:
      "225 Đ. Nguyễn Tri Phương, Phường 9, Quận 5, Thành phố Hồ Chí Minh, Vietnam",
    type: "Đất công/Công viên/Hành lang an toàn giao thông",
    method: "Quảng cáo thương mại",
    images: [],
    accepted: false,
    created_at: "2023-10-23T14:01:29.034Z",
    updated_at: "2023-10-23T14:01:29.034Z",
    __v: 0,
  },
  {
    _id: "65367cb96989f834e0a2e7b3",
    latitude: 10.76008895,
    longitude: 106.6689349,
    ward: "9",
    district: "5",
    address:
      "180A Đ. Nguyễn Tri Phương, Phường 9, Quận 5, Thành phố Hồ Chí Minh 740100, Vietnam",
    type: "Đất công/Công viên/Hành lang an toàn giao thông",
    method: "Quảng cáo thương mại",
    images: [],
    accepted: false,
    created_at: "2023-10-23T14:01:29.107Z",
    updated_at: "2023-10-23T14:01:29.107Z",
    __v: 0,
  },
  {
    _id: "65367cb96989f834e0a2e7b5",
    latitude: 10.75738887,
    longitude: 106.6739202,
    ward: "8",
    district: "5",
    address: "Đ. Trần Phú, Phường 8, Quận 5, Thành phố Hồ Chí Minh, Vietnam",
    type: "Đất tư nhân/Nhà ở riêng lẻ",
    method: "Xã hội hóa",
    images: [],
    accepted: true,
    created_at: "2023-10-23T14:01:29.169Z",
    updated_at: "2023-10-23T14:01:29.169Z",
    __v: 0,
  },
  {
    _id: "65367cb96989f834e0a2e7b7",
    latitude: 10.75672734,
    longitude: 106.6852083,
    ward: "Nguyễn Cư Trinh",
    district: "1",
    address:
      "Đ. Trần Hưng Đạo, Phường Nguyễn Cư Trinh, Quận 1, Thành phố Hồ Chí Minh, Vietnam",
    type: "Đất công/Công viên/Hành lang an toàn giao thông",
    method: "Cổ động chính trị",
    images: [],
    accepted: true,
    created_at: "2023-10-23T14:01:29.225Z",
    updated_at: "2023-10-23T14:01:29.225Z",
    __v: 0,
  },
  {
    _id: "65367cb96989f834e0a2e7b9",
    latitude: 10.76774159,
    longitude: 106.6747759,
    ward: "1",
    district: "3",
    address: "Phường 1, District 3, Ho Chi Minh City, Vietnam",
    type: "Cây xăng",
    method: "Xã hội hóa",
    images: [],
    accepted: true,
    created_at: "2023-10-23T14:01:29.282Z",
    updated_at: "2023-10-23T14:01:29.282Z",
    __v: 0,
  },
  {
    _id: "65367cb96989f834e0a2e7bb",
    latitude: 10.75714338,
    longitude: 106.6782312,
    ward: "2",
    district: "5",
    address:
      "165 Đ. Nguyễn Trãi, Phường 2, Quận 5, Thành phố Hồ Chí Minh, Vietnam",
    type: "Cây xăng",
    method: "Cổ động chính trị",
    images: [],
    accepted: true,
    created_at: "2023-10-23T14:01:29.336Z",
    updated_at: "2023-10-23T14:01:29.336Z",
    __v: 0,
  },
  {
    _id: "65367cb96989f834e0a2e7bd",
    latitude: 10.75556132,
    longitude: 106.6814454,
    ward: "2",
    district: "5",
    address:
      "520 Đ. Trần Hưng Đạo, Phường 2, Quận 5, Thành phố Hồ Chí Minh, Vietnam",
    type: "Nhà chờ xe buýt",
    method: "Quảng cáo thương mại",
    images: [],
    accepted: false,
    created_at: "2023-10-23T14:01:29.409Z",
    updated_at: "2023-10-23T14:01:29.409Z",
    __v: 0,
  },
  {
    _id: "65367cb96989f834e0a2e7bf",
    latitude: 10.757868,
    longitude: 106.689743,
    ward: "Cầu Kho",
    district: "1",
    address: "Cau Kho, Cầu Kho, District 1, Ho Chi Minh City, Vietnam",
    type: "Nhà chờ xe buýt",
    method: "Quảng cáo thương mại",
    images: [],
    accepted: false,
    created_at: "2023-10-23T14:01:29.474Z",
    updated_at: "2023-10-23T14:01:29.474Z",
    __v: 0,
  },
  {
    _id: "65367cb96989f834e0a2e7c1",
    latitude: 10.768549,
    longitude: 106.689913,
    ward: "Phạm Ngũ Lão",
    district: "1",
    address:
      "2 Tôn Thất Tùng, Phường Phạm Ngũ Lão, Quận 1, Thành phố Hồ Chí Minh, Vietnam",
    type: "Đất tư nhân/Nhà ở riêng lẻ",
    method: "Xã hội hóa",
    images: [],
    accepted: false,
    created_at: "2023-10-23T14:01:29.653Z",
    updated_at: "2023-10-23T14:01:29.653Z",
    __v: 0,
  },
  {
    _id: "65367cb96989f834e0a2e7c3",
    latitude: 10.756503,
    longitude: 106.685001,
    ward: "2",
    district: "5",
    address:
      "99 Đ. Nguyễn Văn Cừ, Phường 2, Quận 5, Thành phố Hồ Chí Minh, Vietnam",
    type: "Nhà chờ xe buýt",
    method: "Xã hội hóa",
    images: [],
    accepted: true,
    created_at: "2023-10-23T14:01:29.710Z",
    updated_at: "2023-10-23T14:01:29.710Z",
    __v: 0,
  },
  {
    _id: "65367cb96989f834e0a2e7c5",
    latitude: 10.756708,
    longitude: 106.685207,
    ward: "Nguyễn Cư Trinh",
    district: "1",
    address:
      "Đ. Trần Hưng Đạo, Phường Nguyễn Cư Trinh, Quận 1, Thành phố Hồ Chí Minh, Vietnam",
    type: "Đất công/Công viên/Hành lang an toàn giao thông",
    method: "Cổ động chính trị",
    images: [],
    accepted: true,
    created_at: "2023-10-23T14:01:29.785Z",
    updated_at: "2023-10-23T14:01:29.785Z",
    __v: 0,
  },
  {
    _id: "65367cb96989f834e0a2e7c7",
    latitude: 10.754889,
    longitude: 106.667199,
    ward: "8",
    district: "5",
    address:
      "Chung cư Nguyễn Trãi lô A, Đ. Mạc Thiên Tích, Phường 8, Quận 5, Thành phố Hồ Chí Minh, Vietnam",
    type: "Chợ",
    method: "Xã hội hóa",
    images: [],
    accepted: false,
    created_at: "2023-10-23T14:01:29.840Z",
    updated_at: "2023-10-23T14:01:29.840Z",
    __v: 0,
  },
  {
    _id: "65367cb96989f834e0a2e7c9",
    latitude: 10.771504,
    longitude: 106.692947,
    ward: "Phạm Ngũ Lão",
    district: "1",
    address:
      "7-1 Đ. Lê Thị Riêng, Phường Phạm Ngũ Lão, Quận 1, Thành phố Hồ Chí Minh, Vietnam",
    type: "Chợ",
    method: "Quảng cáo thương mại",
    images: [],
    accepted: false,
    created_at: "2023-10-23T14:01:29.889Z",
    updated_at: "2023-10-23T14:01:29.889Z",
    __v: 0,
  },
  {
    _id: "65367cb96989f834e0a2e7cb",
    latitude: 10.768866,
    longitude: 106.689193,
    ward: "Phạm Ngũ Lão",
    district: "1",
    address:
      "1 Tôn Thất Tùng, Phường Phạm Ngũ Lão, Quận 1, Thành phố Hồ Chí Minh, Vietnam",
    type: "Trung tâm thương mại",
    method: "Quảng cáo thương mại",
    images: [],
    accepted: true,
    created_at: "2023-10-23T14:01:29.989Z",
    updated_at: "2023-10-23T14:01:29.989Z",
    __v: 0,
  },
  {
    _id: "65367cba6989f834e0a2e7cd",
    latitude: 10.767618,
    longitude: 106.679826,
    ward: "2",
    district: "3",
    address:
      "577 Nguyễn Đình Chiểu, Phường 2, Quận 3, Thành phố Hồ Chí Minh, Vietnam",
    type: "Cây xăng",
    method: "Cổ động chính trị",
    images: [],
    accepted: true,
    created_at: "2023-10-23T14:01:30.385Z",
    updated_at: "2023-10-23T14:01:30.385Z",
    __v: 0,
  },
  {
    _id: "65367cba6989f834e0a2e7cf",
    latitude: 10.767383,
    longitude: 106.693982,
    ward: "Phạm Ngũ Lão",
    district: "1",
    address:
      "19 Đ. Bùi Viện, Phường Phạm Ngũ Lão, Quận 1, Thành phố Hồ Chí Minh 700000, Vietnam",
    type: "Đất công/Công viên/Hành lang an toàn giao thông",
    method: "Xã hội hóa",
    images: [],
    accepted: true,
    created_at: "2023-10-23T14:01:30.452Z",
    updated_at: "2023-10-23T14:01:30.452Z",
    __v: 0,
  },
  {
    _id: "65367cba6989f834e0a2e7d1",
    latitude: 10.761071,
    longitude: 106.668448,
    ward: "5",
    district: "10",
    address:
      "279 Đ. Nguyễn Tri Phương, Phường 5, Quận 10, Thành phố Hồ Chí Minh, Vietnam",
    type: "Nhà chờ xe buýt",
    method: "Quảng cáo thương mại",
    images: [],
    accepted: false,
    created_at: "2023-10-23T14:01:30.505Z",
    updated_at: "2023-10-23T14:01:30.505Z",
    __v: 0,
  },
  {
    _id: "65367cbb6989f834e0a2e7d3",
    latitude: 10.760629,
    longitude: 106.688597,
    ward: "Nguyễn Cư Trinh",
    district: "1",
    address:
      "Nguyen Cu Trinh, Phường Nguyễn Cư Trinh, District 1, Ho Chi Minh City, Vietnam",
    type: "Đất công/Công viên/Hành lang an toàn giao thông",
    method: "Quảng cáo thương mại",
    images: [],
    accepted: true,
    created_at: "2023-10-23T14:01:31.039Z",
    updated_at: "2023-10-23T14:01:31.039Z",
    __v: 0,
  },
  {
    _id: "65367cbb6989f834e0a2e7d5",
    latitude: 10.7722534,
    longitude: 106.698366,
    ward: "Bến Thành",
    district: "1",
    address:
      "124 Đ. Lê Lai, Phường Bến Thành, Quận 1, Thành phố Hồ Chí Minh, Vietnam",
    type: "Cây xăng",
    method: "Cổ động chính trị",
    images: [],
    accepted: false,
    created_at: "2023-10-23T14:01:31.342Z",
    updated_at: "2023-10-23T14:01:31.342Z",
    __v: 0,
  },
  {
    _id: "65367cbb6989f834e0a2e7d7",
    latitude: 10.774835,
    longitude: 106.692735,
    ward: "Bến Thành",
    district: "1",
    address:
      "Trương Định, Phường Bến Thành, Quận 1, Thành phố Hồ Chí Minh, Vietnam",
    type: "Trung tâm thương mại",
    method: "Quảng cáo thương mại",
    images: [],
    accepted: true,
    created_at: "2023-10-23T14:01:31.387Z",
    updated_at: "2023-10-23T14:01:31.387Z",
    __v: 0,
  },
  {
    _id: "65367cbb6989f834e0a2e7d9",
    latitude: 10.776686,
    longitude: 106.694861,
    ward: "Bến Thành",
    district: "1",
    address: "Bến Thành, Ben Thanh, District 1, Ho Chi Minh City, Vietnam",
    type: "Cây xăng",
    method: "Quảng cáo thương mại",
    images: [],
    accepted: false,
    created_at: "2023-10-23T14:01:31.444Z",
    updated_at: "2023-10-23T14:01:31.444Z",
    __v: 0,
  },
  {
    _id: "65367cbb6989f834e0a2e7db",
    latitude: 10.779161,
    longitude: 106.692386,
    ward: "6",
    district: "3",
    address: "28 Võ Văn Tần, Phường 6, Quận 3, Thành phố Hồ Chí Minh, Vietnam",
    type: "Đất công/Công viên/Hành lang an toàn giao thông",
    method: "Cổ động chính trị",
    images: [],
    accepted: false,
    created_at: "2023-10-23T14:01:31.494Z",
    updated_at: "2023-10-23T14:01:31.494Z",
    __v: 0,
  },
  {
    _id: "65367cbb6989f834e0a2e7dd",
    latitude: 10.774014,
    longitude: 106.690148,
    ward: "Bến Thành",
    district: "1",
    address:
      "59 Đ. Nguyễn Thị Minh Khai, Phường Bến Thành, Quận 1, Thành phố Hồ Chí Minh, Vietnam",
    type: "Đất tư nhân/Nhà ở riêng lẻ",
    method: "Quảng cáo thương mại",
    images: [],
    accepted: true,
    created_at: "2023-10-23T14:01:31.565Z",
    updated_at: "2023-10-23T14:01:31.565Z",
    __v: 0,
  },
  {
    _id: "65367cbb6989f834e0a2e7df",
    latitude: 10.773814,
    longitude: 106.689421,
    ward: "6",
    district: "1",
    address:
      "250-264 Đ. Nguyễn Thị Minh Khai, Phường 6, Quận 1, Thành phố Hồ Chí Minh, Vietnam",
    type: "Chợ",
    method: "Cổ động chính trị",
    images: [],
    accepted: false,
    created_at: "2023-10-23T14:01:31.633Z",
    updated_at: "2023-10-23T14:01:31.633Z",
    __v: 0,
  },
  {
    _id: "65367cbb6989f834e0a2e7e1",
    latitude: 10.767889,
    longitude: 106.674735,
    ward: "1",
    district: "3",
    address:
      "677-673 Đ. Điện Biên Phủ, Phường 1, Quận 3, Thành phố Hồ Chí Minh, Vietnam",
    type: "Đất tư nhân/Nhà ở riêng lẻ",
    method: "Cổ động chính trị",
    images: [],
    accepted: true,
    created_at: "2023-10-23T14:01:31.680Z",
    updated_at: "2023-10-23T14:01:31.680Z",
    __v: 0,
  },
  {
    _id: "65367cbb6989f834e0a2e7e3",
    latitude: 10.76806,
    longitude: 106.674406,
    ward: "10",
    district: "10",
    address:
      "786 Đ. Điện Biên Phủ, Phường 10, Quận 10, Thành phố Hồ Chí Minh 700000, Vietnam",
    type: "Chợ",
    method: "Quảng cáo thương mại",
    images: [],
    accepted: false,
    created_at: "2023-10-23T14:01:31.737Z",
    updated_at: "2023-10-23T14:01:31.737Z",
    __v: 0,
  },
  {
    _id: "65367cbb6989f834e0a2e7e5",
    latitude: 10.765816,
    longitude: 106.681558,
    ward: "2",
    district: "3",
    address:
      "Ngã sáu Cộng Hòa, Phường 2, Quận 3, Thành phố Hồ Chí Minh, Vietnam",
    type: "Đất tư nhân/Nhà ở riêng lẻ",
    method: "Xã hội hóa",
    images: [],
    accepted: true,
    created_at: "2023-10-23T14:01:31.796Z",
    updated_at: "2023-10-23T14:01:31.796Z",
    __v: 0,
  },
  {
    _id: "65367cbb6989f834e0a2e7e7",
    latitude: 10.766926,
    longitude: 106.676044,
    ward: "1",
    district: "10",
    address:
      "63 Đ. Lý Thái Tổ, Phường 1, Quận 10, Thành phố Hồ Chí Minh, Vietnam",
    type: "Chợ",
    method: "Xã hội hóa",
    images: [],
    accepted: true,
    created_at: "2023-10-23T14:01:31.853Z",
    updated_at: "2023-10-23T14:01:31.853Z",
    __v: 0,
  },
  {
    _id: "65367cbb6989f834e0a2e7e9",
    latitude: 10.773571,
    longitude: 106.689043,
    ward: "5",
    district: "3",
    address:
      "290 Đ. Nguyễn Thị Minh Khai, Phường 5, Quận 3, Thành phố Hồ Chí Minh, Vietnam",
    type: "Nhà chờ xe buýt",
    method: "Xã hội hóa",
    images: [],
    accepted: false,
    created_at: "2023-10-23T14:01:31.917Z",
    updated_at: "2023-10-23T14:01:31.917Z",
    __v: 0,
  },
  {
    _id: "65367cbb6989f834e0a2e7eb",
    latitude: 10.768532,
    longitude: 106.683994,
    ward: "5",
    district: "3",
    address:
      "Hẻm 02 Cao Thắng, Phường 5, Quận 3, Thành phố Hồ Chí Minh, Vietnam",
    type: "Đất công/Công viên/Hành lang an toàn giao thông",
    method: "Xã hội hóa",
    images: [],
    accepted: true,
    created_at: "2023-10-23T14:01:31.971Z",
    updated_at: "2023-10-23T14:01:31.971Z",
    __v: 0,
  },
  {
    _id: "65367cbc6989f834e0a2e7ed",
    latitude: 10.767454,
    longitude: 106.686392,
    ward: "Nguyễn Cư Trinh",
    district: "1",
    address:
      "189C Đ. Cống Quỳnh, Phường Nguyễn Cư Trinh, Quận 1, Thành phố Hồ Chí Minh, Vietnam",
    type: "Đất công/Công viên/Hành lang an toàn giao thông",
    method: "Cổ động chính trị",
    images: [],
    accepted: true,
    created_at: "2023-10-23T14:01:32.022Z",
    updated_at: "2023-10-23T14:01:32.022Z",
    __v: 0,
  },
  {
    _id: "65367cbc6989f834e0a2e7ef",
    latitude: 10.766534,
    longitude: 106.688275,
    ward: "Nguyễn Cư Trinh",
    district: "1",
    address:
      "185F Đ. Cống Quỳnh, Phường Nguyễn Cư Trinh, Quận 1, Thành phố Hồ Chí Minh, Vietnam",
    type: "Đất công/Công viên/Hành lang an toàn giao thông",
    method: "Quảng cáo thương mại",
    images: [],
    accepted: true,
    created_at: "2023-10-23T14:01:32.073Z",
    updated_at: "2023-10-23T14:01:32.073Z",
    __v: 0,
  },
  {
    _id: "65367cbc6989f834e0a2e7f1",
    latitude: 10.75939,
    longitude: 106.684167,
    ward: "Nguyễn Cư Trinh",
    district: "5",
    address:
      "Đ. Nguyễn Văn Cừ, Phường Nguyễn Cư Trinh, Quận 5, Thành phố Hồ Chí Minh, Vietnam",
    type: "Đất tư nhân/Nhà ở riêng lẻ",
    method: "Quảng cáo thương mại",
    images: [],
    accepted: false,
    created_at: "2023-10-23T14:01:32.129Z",
    updated_at: "2023-10-23T14:01:32.129Z",
    __v: 0,
  },
  {
    _id: "65367cbc6989f834e0a2e7f3",
    latitude: 10.756287,
    longitude: 106.685117,
    ward: "1",
    district: "5",
    address:
      "613 Đ. Trần Hưng Đạo, Phường 1, Quận 5, Thành phố Hồ Chí Minh, Vietnam",
    type: "Cây xăng",
    method: "Quảng cáo thương mại",
    images: [],
    accepted: false,
    created_at: "2023-10-23T14:01:32.182Z",
    updated_at: "2023-10-23T14:01:32.182Z",
    __v: 0,
  },
  {
    _id: "65367cbc6989f834e0a2e7f5",
    latitude: 10.755891,
    longitude: 106.683859,
    ward: "1",
    district: "5",
    address: "Đ. Nguyễn Biểu, Phường 1, Quận 5, Thành phố Hồ Chí Minh, Vietnam",
    type: "Đất tư nhân/Nhà ở riêng lẻ",
    method: "Cổ động chính trị",
    images: [],
    accepted: true,
    created_at: "2023-10-23T14:01:32.227Z",
    updated_at: "2023-10-23T14:01:32.227Z",
    __v: 0,
  },
  {
    _id: "65367cbc6989f834e0a2e7f7",
    latitude: 10.757464,
    longitude: 106.674281,
    ward: "8",
    district: "5",
    address:
      "Đ. An Dương Vương, Phường 8, Quận 5, Thành phố Hồ Chí Minh, Vietnam",
    type: "Cây xăng",
    method: "Cổ động chính trị",
    images: [],
    accepted: false,
    created_at: "2023-10-23T14:01:32.286Z",
    updated_at: "2023-10-23T14:01:32.286Z",
    __v: 0,
  },
  {
    _id: "65367cbc6989f834e0a2e7f9",
    latitude: 10.757906,
    longitude: 106.67221,
    ward: "9 ",
    district: "5",
    address:
      "34-36 Đ. An Dương Vương, Phường 9, Quận 5, Thành phố Hồ Chí Minh, Vietnam",
    type: "Chợ",
    method: "Quảng cáo thương mại",
    images: [],
    accepted: true,
    created_at: "2023-10-23T14:01:32.384Z",
    updated_at: "2023-10-23T14:01:32.384Z",
    __v: 0,
  },
  {
    _id: "65367cbc6989f834e0a2e7fb",
    latitude: 10.756104,
    longitude: 106.666262,
    ward: "11",
    district: "5",
    address:
      "Đ. An Dương Vương, Phường 11, Quận 5, Thành phố Hồ Chí Minh, Vietnam",
    type: "Nhà chờ xe buýt",
    method: "Cổ động chính trị",
    images: [],
    accepted: false,
    created_at: "2023-10-23T14:01:32.457Z",
    updated_at: "2023-10-23T14:01:32.457Z",
    __v: 0,
  },
  {
    _id: "65367cbc6989f834e0a2e7fd",
    latitude: 10.768222,
    longitude: 106.673732,
    ward: "10",
    district: "10",
    address:
      "537 - 539 Tổ 1 Khu phố 1, Phường 10, Quận 10, Thành phố Hồ Chí Minh, Vietnam",
    type: "Cây xăng",
    method: "Cổ động chính trị",
    images: [],
    accepted: false,
    created_at: "2023-10-23T14:01:32.521Z",
    updated_at: "2023-10-23T14:01:32.521Z",
    __v: 0,
  },
  {
    _id: "65367cbc6989f834e0a2e7ff",
    latitude: 10.759748,
    longitude: 106.669303,
    ward: "9",
    district: "5",
    address:
      "Đ. Nguyễn Chí Thanh, Phường 9, Quận 5, Thành phố Hồ Chí Minh, Vietnam",
    type: "Chợ",
    method: "Quảng cáo thương mại",
    images: [],
    accepted: false,
    created_at: "2023-10-23T14:01:32.624Z",
    updated_at: "2023-10-23T14:01:32.624Z",
    __v: 0,
  },
  {
    _id: "65367cbc6989f834e0a2e801",
    latitude: 10.761248,
    longitude: 106.677239,
    ward: "4",
    district: "5",
    address:
      "138 Đ. Trần Phú, Phường 4, Quận 5, Thành phố Hồ Chí Minh, Vietnam",
    type: "Đất tư nhân/Nhà ở riêng lẻ",
    method: "Cổ động chính trị",
    images: [],
    accepted: true,
    created_at: "2023-10-23T14:01:32.714Z",
    updated_at: "2023-10-23T14:01:32.714Z",
    __v: 0,
  },
  {
    _id: "65367cbc6989f834e0a2e803",
    latitude: 10.758683,
    longitude: 106.677922,
    ward: "3",
    district: "5",
    address:
      "Đ. Lê Hồng Phong, Phường 3, Quận 5, Thành phố Hồ Chí Minh, Vietnam",
    type: "Cây xăng",
    method: "Quảng cáo thương mại",
    images: [],
    accepted: false,
    created_at: "2023-10-23T14:01:32.845Z",
    updated_at: "2023-10-23T14:01:32.845Z",
    __v: 0,
  },
  {
    _id: "65367cbc6989f834e0a2e805",
    latitude: 10.761242,
    longitude: 106.683093,
    ward: "4",
    district: "5",
    address:
      "Ho Chi Minh City, Phường 4, District 5, Ho Chi Minh City, Vietnam",
    type: "Đất công/Công viên/Hành lang an toàn giao thông",
    method: "Quảng cáo thương mại",
    images: [],
    accepted: false,
    created_at: "2023-10-23T14:01:32.900Z",
    updated_at: "2023-10-23T14:01:32.900Z",
    __v: 0,
  },
  {
    _id: "65367cbc6989f834e0a2e807",
    latitude: 10.765107,
    longitude: 106.681336,
    ward: "4",
    district: "5",
    address: "Đ. Trần Phú, Phường 4, Quận 5, Thành phố Hồ Chí Minh, Vietnam",
    type: "Trung tâm thương mại",
    method: "Xã hội hóa",
    images: [],
    accepted: true,
    created_at: "2023-10-23T14:01:32.986Z",
    updated_at: "2023-10-23T14:01:32.986Z",
    __v: 0,
  },
];

mapboxgl.accessToken =
  "pk.eyJ1Ijoibm1raG9pMjEiLCJhIjoiY2xvMno5ZzhyMGQzdTJ2bGVkbTc4bGZ5dSJ9.9ljGVzjte5iqJXpbOiAN1Q";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center: [106.68247166663183, 10.762993690850745],
  zoom: 15,
});
const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  reverseGeocode: true,
  flipCoordinates: true,
  marker: {
    color: "red",
  },
  flyTo: {
    bearing: 0,
    animate: true,
    duration: 750,
    speed: 1,
    essential: true,
    curve: 1,
    easing: function (t) {
      return Math.sin((t * Math.PI) / 2);
    },
  },
});
map.addControl(geocoder);
const sidebar = document.querySelector(".sidebar-content");
const sidebarItems = [];

let currentMarker = null;

const AdsCardFactory = (position) => {
  const elm = document.createElement("div");
  elm.innerHTML = `
                  <div class="card-header text-center fw-bold fs-4 font-weight-bold py-3">Tra cụm pano</div>
                  <div class="card-body">
                    <h5 class="card-title fw-bold">${position.address}</h5>
                    <h5 class="card-text">Kích thước: 2.5m x 10m</h5>
                    <h5 class="card-text">Số lượng: 1 trụ/bảng</h5>
                    <h5 class="card-text">Hình thức: ${position.method}</h5>
                    <h5 class="card-text">Phân loại: ${position.type}</h5>
                    <div class="d-flex">
                      <div class="me-auto p-2 d-flex align-items-center">
                          <i data-bs-toggle="modal" data-bs-target="#ads-detail" class="bi bi-info-circle"></i>
                      </div>
                      <div class="p-2">
                        <button type="button"
                          class="btn btn-danger"
                          data-bs-toggle="modal"
                          data-bs-target="#feedback">
                          Báo cáo vi phạm
                        </button>
                      </div>
                    </div>
                  </div>
                `;
  elm.className = "ads-card card bg-light my-3";
  elm.style = "max-width: 20rem;";
  return elm;
};

const locationCardFactory = (result) => {
  const elm = document.createElement("div");
  elm.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-check2-circle flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                    <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z"/>
                    <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z"/>
                  </svg>
                  <div>
                    <h5 class="font-weight-bold"> Thông tin địa điểm </h5>
                    <h5 class="font-weight-bold">
                      ${result.text}
                    </h5>
                    <h5>
                      ${result.place_name ? result.place_name : ""}
                    </h5>
                    <div class="d-flex justify-content-end">
                      <button type="button"
                        class="btn btn-danger"
                        data-bs-toggle="modal"
                        data-bs-target="#feedback">
                        Báo cáo vi phạm
                      </button>
                    </div>
                  </div>`;
  elm.className = "alert alert-success d-flex m-4";
  return elm;
};

const reportCardFactory = () => {
  const elem = document.createElement("div");
  elem.innerHTML = `
            <div class="card-header text-center fw-bold fs-4 font-weight-bold py-3">Đóng góp ý kiến</div>
              <div class="card-body">
                <h5 class="card-text">Báo cáo bởi: Minh Khôi</h5>
                <h5 class="card-text">Nội dung báo cáo: Trụ pano hiển thị nội dung sai, nội dung chưa phù hợp với vị trí đặt</h5>
              </div>
            </div>
          `;
  elem.className = "report-card card text-white bg-danger my-3";
  elem.style = "max-width: 18rem;";
  return elem;
};

const detailCardFactory = () => {
  const elem = document.createElement("div");
  elem.innerHTML = `
            <!-- Carousel -->
            <div id="demo" class="carousel slide" data-bs-ride="carousel">
  
              <!-- Indicators/dots -->
              <div class="carousel-indicators">
                <button type="button" data-bs-target="#demo" data-bs-slide-to="0" class="active"></button>
                <button type="button" data-bs-target="#demo" data-bs-slide-to="1"></button>
                <button type="button" data-bs-target="#demo" data-bs-slide-to="2"></button>
              </div>
              
              <!-- The slideshow/carousel -->
              <div class="carousel-inner">
                <div class="carousel-item active">
                  <img src="./images/ads1.jpg" alt="ads-1" class="d-block" style="width:100%;">
                </div>
                <div class="carousel-item">
                  <img src="./images/ads2.jpg" alt="ads-2" class="d-block" style="width:100%">
                </div>
                <div class="carousel-item">
                  <img src="./images/ads3.jpg" alt="ads-3" class="d-block" style="width:100%">
                </div>
              </div>
              
              <!-- Left and right controls/icons -->
              <button class="carousel-control-prev" type="button" data-bs-target="#demo" data-bs-slide="prev">
                <span class="carousel-control-prev-icon"></span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#demo" data-bs-slide="next">
                <span class="carousel-control-next-icon"></span>
              </button>
            </div>
            <div class="container-fluid mt-3">
              <p class="text-center">Ngày hết hạn hợp đồng: 28/10/2023</p>
            </div>
          `;
  return elem;
};

const clearSidebar = () => {
  while (sidebarItems.length) {
    sidebarItems.pop().remove();
  }
};

const addToSideBar = (elm) => {
  sidebarItems.push(elm);
  sidebar.appendChild(elm);
};

const removeOutSideBar = (className) => {
  const sidebarContent = document.querySelector(".sidebar-content");
  const elem = document.querySelector(className);
  sidebarContent.removeChild(elem);
};

async function addMarker(x, y) {
  if (currentMarker) {
    currentMarker.remove();
  }
  const el = document.createElement("div");
  el.className = "marker";
  currentMarker = new mapboxgl.Marker(el).setLngLat([x, y]).addTo(map);
}
// Side bar
function toggleSidebar() {
  const elem = document.getElementById("sidebar");

  const arrow = document.querySelector(".sidebar-toggle");
  arrow.classList.toggle("rotated");
  const collapsed = elem.classList.toggle("collapsed");

  map.easeTo({
    padding: collapsed ? 0 : 300,
    essential: true,
    duration: 1000, // In ms. This matches the CSS transition duration property.
  });
}

function addReportLayer(map) {
  map.addLayer({
    id: "report-point",
    type: "circle",
    source: "AdsLocations",
    filter: ["==", ["get", "status"], "Đã quy hoạch"],
    paint: {
      "circle-radius": 15,
      "circle-opacity": 0,
      "circle-stroke-width": 2,
      "circle-stroke-color": "red",
    },
  });
}

function addAdsLayer(map) {
  map.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "AdsLocations",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#11b4da",
      "circle-radius": 15,
    },
  });
}

function addTextLayer(map, content) {
  let filterType = [];
  if (content == "BC") {
    filterType = ["==", ["get", "status"], "Đã quy hoạch"];
  } else {
    filterType = ["!", ["has", "point_count"]];
  }
  map.addLayer({
    id: "text-point",
    type: "symbol",
    source: "AdsLocations",
    filter: filterType,
    layout: {
      "text-field": content,
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
    },
  });
}

async function initMap() {
  // const locations = await logLocations();
  const geojson = {
    type: "FeatureCollection",
    features: [],
  };
  locations.map((location) => {
    const feature = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [location.longitude, location.latitude],
      },
      properties: {
        method: location.method,
        type: location.type,
        address: location.address,
        status: location.accepted ? "Đã quy hoạch" : "Chưa quy hoạch",
      },
    };
    geojson.features.push(feature);
  });

  map.on("load", () => {
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    map.addSource("AdsLocations", {
      type: "geojson",
      data: geojson,
      cluster: true,
      clusterMaxZoom: 35,
      clusterRadius: 50,
    });

    map.addLayer({
      id: "clusters",
      type: "circle",
      source: "AdsLocations",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": [
          "step",
          ["get", "point_count"],
          "#51bbd6",
          10,
          "#f1f075",
          30,
          "#f28cb1",
        ],
        "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
      },
    });

    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "AdsLocations",
      filter: ["has", "point_count"],
      layout: {
        "text-field": ["get", "point_count_abbreviated"],
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12,
      },
    });

    addAdsLayer(map);

    const adsSwitch = document.querySelector("#adsSwitch");
    adsSwitch.addEventListener("change", () => {
      if (adsSwitch.checked) {
        map.removeLayer("text-point");
        addAdsLayer(map);
        addTextLayer(map, "QC");
      } else {
        map.removeLayer("unclustered-point");
        map.removeLayer("text-point");
        addTextLayer(map, "BC");
      }
    });

    addReportLayer(map);

    const reportSwitch = document.querySelector("#reportSwitch");
    reportSwitch.addEventListener("change", () => {
      if (reportSwitch.checked) {
        addReportLayer(map);
      } else {
        map.removeLayer("report-point");
      }
    });

    addTextLayer(map, "QC");

    map.on("click", "clusters", (e) => {
      e.clickOnLayer = true;
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["clusters"],
      });
      const clusterId = features[0].properties.cluster_id;
      map
        .getSource("AdsLocations")
        .getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;

          map.easeTo({
            center: features[0].geometry.coordinates,
            duration: 500,
            essential: true,
            zoom: zoom,
          });
        });
    });

    map.on("click", ["unclustered-point"], (e) => {
      e.clickOnLayer = true;
    });

    map.on("mouseenter", ["unclustered-point"], (e) => {
      map.getCanvas().style.cursor = "pointer";
      const coordinates = e.features[0].geometry.coordinates.slice();

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      popup
        .setLngLat(coordinates)
        .setHTML(
          `<h6 class="fw-bold">${e.features[0].properties.method}</h6>
                    <p>${e.features[0].properties.type}</p>
                    <p>${e.features[0].properties.address}</p>
                    <h5 class="fw-bold fst-italic text-uppercase">${e.features[0].properties.status}</h5>`
        )
        .addTo(map);
    });

    map.on("mouseleave", ["unclustered-point", "report-point"], () => {
      map.getCanvas().style.cursor = "";
      popup.remove();
    });

    map.on("mouseenter", "clusters", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "clusters", () => {
      map.getCanvas().style.cursor = "";
    });

    // Reverse geocoding
    map.on("click", (e) => {
      if (e.clickOnLayer) {
        return;
      }
      let m = e.lngLat.wrap();
      geocoder.query(`${m.lng}, ${m.lat}`);
    });
  });

  geocoder.on("result", (e) => {
    clearSidebar();
    const locationCard = locationCardFactory(e.result);
    addToSideBar(locationCard);
  });

  map.on("click", ["unclustered-point", "report-point"], (e) => {
    const features = e.features[0];
    clearSidebar();
    const infoButton = document.querySelector(".info-btn");
    infoButton.addEventListener("click", () => {
      removeOutSideBar(".report-card");
      const adsCard = AdsCardFactory(features.properties);
      addToSideBar(adsCard);
    });
    const reportButton = document.querySelector(".report-btn");
    reportButton.addEventListener("click", () => {
      removeOutSideBar(".ads-card");
      const reportCard = reportCardFactory();
      addToSideBar(reportCard);
    });
    const adsCard = AdsCardFactory(features.properties);
    addToSideBar(adsCard);
    const detailIcon = document.querySelector(".bi-info-circle");
    detailIcon.addEventListener("click", () => {
      const infoDetailModal = document.querySelector(".modal-info-detail");
      const infoDetailCard = detailCardFactory();
      infoDetailModal.appendChild(infoDetailCard);
    });
    const sidebar = document.getElementById("sidebar");
    if (sidebar.classList.contains("collapsed")) {
      toggleSidebar();
    }
  });

  // Add geolocate control to the map.
  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      // When active the map will receive updates to the device's location as it changes.
      trackUserLocation: true,
      // Draw an arrow next to the location dot to indicate which direction the device is heading.
      showUserHeading: true,
    })
  );

  // Add zoom and rotation controls to the map.
  map.addControl(new mapboxgl.NavigationControl());
}

initMap();
