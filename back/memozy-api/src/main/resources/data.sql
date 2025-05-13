-- 1. Users (1명)
INSERT INTO users (user_id, name, email, profile_image, created_at, personal_id)
VALUES (1, '홍길동', 'hong@example.com', 'https://image.example.com/hong.jpg', NOW(), 123456);

-- 2. Collections (3개)
INSERT INTO collections (collection_id, user_id, name, created_at, updated_at, code)
VALUES (1, 1, '유럽 여행', NOW(), NOW(), 'EURO2025'),
       (2, 1, '세계사 퀴즈', NOW(), NOW(), 'WORLDHIS'),
       (3, 1, '예술작품 퀴즈', NOW(), NOW(), 'ART2025');

-- 3. Quiz_sources (8개)
INSERT INTO quiz_sources (source_id, title, summary, url, created_at, user_id, collection_id)
VALUES (1, '루브르 박물관 개요', '세계 최대의 미술관 중 하나', 'https://museum.example.com/louvre', NOW(), 1, 3),
       (2, '세계 2차 대전 개요', '1939년부터 시작된 세계 대전', 'https://history.example.com/ww2', NOW(), 1, 2),
       (3, '파리 여행 가이드', '에펠탑 등 파리 명소 소개', 'https://travel.example.com/paris', NOW(), 1, 1),
       (4, '르네상스 미술', '르네상스 시대의 대표적 예술사조', 'https://art.example.com/renaissance', NOW(), 1, 3),
       (5, '세계 문화유산', '유네스코 지정 문화유산 개요', 'https://culture.example.com/heritage', NOW(), 1, 1),
       (6, '로마의 역사', '로마제국의 흥망성쇠', 'https://history.example.com/rome', NOW(), 1, 2),
       (7, '빈센트 반 고흐', '고흐의 삶과 작품', 'https://artist.example.com/van-gogh', NOW(), 1, 3),
       (8, '프랑스 혁명', '1789년 프랑스 혁명의 배경과 결과', 'https://history.example.com/revolution', NOW(), 1, 2);

INSERT INTO quizzes (quiz_id, content, type, answer, commentary, created_at, collection_id, source_id)
VALUES
-- source 1 (3개)
(1, '루브르 박물관이 위치한 도시는?', 'MULTIPLE_CHOICE', '파리', '루브르는 파리에 있습니다.', NOW(), 3, 1),
(2, '루브르 박물관은 프랑스에 있다. 맞으면 O, 틀리면 X', 'OX', 'O', '프랑스에 위치합니다.', NOW(), 3, 1),
(3, '루브르에는 모나리자가 있다. 맞으면 O, 틀리면 X', 'OX', 'O', '모나리자는 루브르에 있습니다.', NOW(), 3, 1),

-- source 2 (4개)
(4, '2차 세계대전 시작 연도는?', 'OBJECTIVE', '1939', '1939년입니다.', NOW(), 2, 2),
(5, '2차 대전은 1939년부터 1945년까지였다. 맞으면 O, 틀리면 X', 'OX', 'O', '정확합니다.', NOW(), 2, 2),
(6, '2차 대전의 주요 전투는?', 'MULTIPLE_CHOICE', '노르망디 상륙작전', '중요한 전투 중 하나입니다.', NOW(), 2, 2),
(7, '히틀러가 소속된 정당은?', 'OBJECTIVE', '나치당', '나치당입니다.', NOW(), 2, 2),

-- source 3 (5개)
(8, '파리에 있는 상징적 구조물은?', 'MULTIPLE_CHOICE', '에펠탑', '에펠탑은 파리의 상징입니다.', NOW(), 1, 3),
(9, '파리는 프랑스의 수도다. 맞으면 O, 틀리면 X', 'OX', 'O', '수도 맞습니다.', NOW(), 1, 3),
(10, '파리에서 가장 유명한 미술관은?', 'MULTIPLE_CHOICE', '루브르', '루브르 미술관이 가장 유명합니다.', NOW(), 1, 3),
(11, '파리의 별명은?', 'OBJECTIVE', '빛의 도시', 'La Ville Lumière, 빛의 도시입니다.', NOW(), 1, 3),
(12, '파리의 대표적인 강은?', 'MULTIPLE_CHOICE', '센강', '센강이 흐릅니다.', NOW(), 1, 3),

-- source 4 (3개)
(13, '르네상스 시기의 대표 화가는?', 'MULTIPLE_CHOICE', '레오나르도 다 빈치', '대표적인 화가입니다.', NOW(), 3, 4),
(14, '르네상스는 고대 회귀의 문화 운동이다. 맞으면 O, 틀리면 X', 'OX', 'O', '그렇습니다.', NOW(), 3, 4),
(15, '다 빈치가 그린 작품은?', 'MULTIPLE_CHOICE', '모나리자', '다 빈치의 대표작입니다.', NOW(), 3, 4),

-- source 5 (5개)
(16, '유네스코 문화유산의 목적은?', 'OBJECTIVE', '보존', '보존과 계승입니다.', NOW(), 1, 5),
(17, '경주는 세계 문화유산 도시이다. 맞으면 O, 틀리면 X', 'OX', 'O', '맞습니다.', NOW(), 1, 5),
(18, '세계문화유산이 아닌 것은?', 'MULTIPLE_CHOICE', '타워브릿지', '영국의 관광지지만 문화유산은 아님.', NOW(), 1, 5),
(19, '문화유산은 유네스코가 관리한다. 맞으면 O, 틀리면 X', 'OX', 'O', '맞습니다.', NOW(), 1, 5),
(20, '앙코르와트는 어느 나라에 있는가?', 'MULTIPLE_CHOICE', '캄보디아', '캄보디아입니다.', NOW(), 1, 5),

-- source 6 (3개)
(21, '로마 제국은 어느 대륙에서 시작되었는가?', 'MULTIPLE_CHOICE', '유럽', '유럽에서 시작.', NOW(), 2, 6),
(22, '로마는 공화정에서 시작되었다. 맞으면 O, 틀리면 X', 'OX', 'O', '공화정에서 시작.', NOW(), 2, 6),
(23, '로마의 멸망 연도는?', 'OBJECTIVE', '476', '서로마 제국 멸망은 476년입니다.', NOW(), 2, 6),

-- source 7 (4개)
(24, '고흐의 대표작은?', 'MULTIPLE_CHOICE', '별이 빛나는 밤', '대표작 중 하나입니다.', NOW(), 3, 7),
(25, '고흐는 생전에 성공했다. 맞으면 O, 틀리면 X', 'OX', 'X', '생전에는 거의 무명이었습니다.', NOW(), 3, 7),
(26, '고흐는 어느 나라 사람인가?', 'MULTIPLE_CHOICE', '네덜란드', '네덜란드 출신입니다.', NOW(), 3, 7),
(27, '고흐의 동생 이름은?', 'OBJECTIVE', '테오', '테오 반 고흐입니다.', NOW(), 3, 7),

-- source 8 (4개)
(28, '프랑스 혁명은 몇 년도에 시작되었나?', 'OBJECTIVE', '1789', '1789년입니다.', NOW(), 2, 8),
(29, '프랑스 혁명의 상징은?', 'MULTIPLE_CHOICE', '바스티유 감옥 습격', '혁명의 시작입니다.', NOW(), 2, 8),
(30, '프랑스 혁명은 절대왕정을 무너뜨렸다. 맞으면 O, 틀리면 X', 'OX', 'O', '정확히 맞습니다.', NOW(), 2, 8),
(31, '프랑스 혁명 후 왕은?', 'OBJECTIVE', '루이 16세', '루이 16세가 단두대에서 처형되었습니다.', NOW(), 2, 8);
