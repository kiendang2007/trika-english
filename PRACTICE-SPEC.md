# Luyện tập: định dạng dữ liệu

Chốt ngày 25/09. Mỗi file trong `content/practice/` là một phần luyện tập của một giai đoạn.
Website đọc mọi file bằng `import.meta.glob('/content/practice/*.json', { eager: true })` và
sắp xếp theo `practice_id`.

## Khoá chung của một file

| Khoá | Nghĩa |
|---|---|
| `practice_id` | "1.1", "9.3": giai đoạn chấm số thứ tự phần |
| `stage` | giai đoạn, số nguyên 1 đến 11 |
| `title_vi` | tiêu đề hiện trên màn hình |
| `type` | `select_words`, `sort_two`, `mcq`, `blank`, `reorder`, `two_step` |
| `items` | mảng mười câu hỏi, đúng thứ tự hiển thị |
| `video_url` | luôn null trong v1 |
| `_internal` | nội bộ, website không đọc |

Mọi item có `id`, `type`, `rule_vi`. Không item nào có `fallback_vi`.

## `select_words` (chọn từ)

`tokens` là mảng từ, đúng thứ tự trong câu, dấu câu dính liền với từ.
`answer_indices` là vị trí các từ đúng trong `tokens`, đếm từ 0.
`count` bằng số từ phải chọn, luôn hiện trên màn hình.

Nút Kiểm tra chỉ bật khi số từ đã chọn đúng bằng `count`. Chọn thừa thì không bấm được, chọn
thiếu cũng vậy. Một từ xuất hiện hai lần trong câu là hai vị trí khác nhau.

## `sort_two` (xếp vào hai nhóm)

`left_label_vi` và `right_label_vi` là tên hai cột. Mỗi phần tử của `chips` có `word` và
`group` (`left` hoặc `right`). Số từ hai bên không bằng nhau, và thứ tự trong file đã xáo sẵn.

`explanations` có đúng mười phần tử, mỗi từ một câu giải thích. Sau khi kiểm tra, website hiện
**toàn bộ mười câu**, kể cả những từ người học xếp đúng.

## `mcq`

`options` gồm `key` và `text`. `answer` là `key` của đáp án đúng.

## `blank` (điền vào chỗ trống)

`sentence_en` chứa `___` ở chỗ trống. `prompt_vi` là câu tiếng Việt đặt phía trên, có ở phần
6.2, 7.1 và 10.1. `options` có thể tới mười một lựa chọn (phần 6.2). `answer_text` là chữ đúng
như khi viết vào câu, có thể viết hoa khi chỗ trống đứng đầu câu.

## `reorder` (sắp xếp)

`chips` là các từ đã xáo. `answer` là câu đúng. Dấu chấm hỏi là một chip riêng. Câu trần thuật
không có chip dấu chấm; website tự thêm dấu chấm khi hiện câu trả lời.

## `two_step` (hai bước)

`step1`: người học kéo một thì, một thể và một dạng vào bảng. Đáp án ở `step1.answer`.
`step2`: sắp xếp câu. `chips` gồm các từ của câu đúng cộng `decoys`, là một trợ động từ thừa và
một dạng động từ chính thừa. Người học chỉ được dùng một trợ động từ và một dạng động từ chính,
nên nếu kéo cả hai thì không bấm được Kiểm tra.

Bước 2 chỉ mở sau khi bước 1 đúng.

## Luật chấm

Sai thì chạy đúng vòng bốn bước như ở material: Sai, cái đã chọn, sai ở đâu, quy tắc, rồi Thử
lại. Không chấm điểm, không đếm số câu đúng, không hiện tỉ lệ.

## Gating

Chốt ngày 28/09, thay quy tắc cũ ở D25.

Phần luyện tập của một giai đoạn mở cùng lúc với giai đoạn đó. Giai đoạn nào người học mở được
thì mọi phần luyện tập của giai đoạn đó cũng mở được, không cần làm xong câu hỏi trong bài trước.
Luyện tập của một giai đoạn chưa mở thì vẫn hiện ra và vẫn bấm được, kèm lời từ chối như cũ.

Làm xong tất cả các phần luyện tập của một giai đoạn là điều kiện để mở giai đoạn sau. Câu hỏi
trong bài không còn quyết định việc này. Một phần luyện tập xong khi mọi câu trong đó đã được trả
lời đúng ít nhất một lần. Kết quả lưu theo từng câu, nên bấm "Làm lại" không xoá gì.

Giai đoạn nào không có file luyện tập nào thì giữ quy tắc cũ: các bài học của giai đoạn đó quyết
định. Hiện tại cả mười một giai đoạn đều có luyện tập. Danh sách này đọc từ `content/practice/`,
không ghi cứng trong code.

`current_stage` chỉ tăng một bậc khi giai đoạn vừa xong đúng bằng giai đoạn hiện tại. Nó không bao
giờ giảm và không bao giờ vượt quá giai đoạn cuối. Làm lại luyện tập của một giai đoạn cũ không
đổi gì. Giai đoạn 11 là giai đoạn cuối: xong phần luyện tập cuối của nó là hết lộ trình, và
`current_stage` vẫn là 11.
