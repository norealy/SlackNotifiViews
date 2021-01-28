# Thiết Kế Card Slack
***
## Luồng phương thức Modals in slack apps
- **Modal flows**
![modal](./img/modal-view-stack.png)
1. Người dùng tương tác với entry point vào ứng dụng.
2. Với **trigger_id** từ tải trọng và chế độ xem ban đầu mới được tạo (chế độ xem A), ứng dụng sử dụng `views.open` để bắt đầu một phương thức.
3. Người dùng tương tác với một thành phần tương tác trong chế độ xem A. Điều này sẽ gửi một trọng tải tương tác khác đến ứng dụng.
4. HIển thị với nội dung đã thay đổi với `views.update`
5. Người dùng tương tác với một thành phần tương tác khác trong chế độ xem A. Một khối lượng tương tác khác được gửi đến ứng dụng.
6. Lần này, ứng dụng sử dụng ngữ cảnh từ tải trọng mới để đẩy một chế độ xem mới (chế độ xem B).
7. Người dùng nhập một số giá trị vào các khối đầu vào trong chế độ xem B và nhấp vào nút gửi của chế độ xem. Điều này sẽ gửi một loại trọng tải tương tác khác đến ứng dụng.
8. Ứng dụng xử lý việc `views.submission` và phản hồi bằng cách xóa ngăn xếp chế độ xem.

***
### Getting started with modals

Bạn cần access token , hoặc tạo ứng dụng [Create App](https://api.slack.com/apps?new_app=1)


**1. Chuẩn bị**

Sau khi gửi chế độ xem phương thức, một trọng tải tương tác sẽ được gửi đến URL yêu cầu của ứng dụng của bạn. Ngoài ra, nếu chế độ xem của bạn bao gồm bất kỳ thành phần tương tác nào của Bộ công cụ khối, bạn cũng sẽ nhận được tải trọng tương tác khi sử dụng thành phần.

Do đó, để chuẩn bị cho ứng dụng của bạn sử dụng các phương thức, bạn cần bật Thành phần tương tác trong trang tổng quan quản lý của ứng dụng.

**2. Tạo views modals**

Trước khi mở một phương thức, bạn sẽ cần soạn một đối tượng dạng xem để xác định bố cục của dạng xem ban đầu.

Đối tượng dạng xem là một đối tượng JSON xác định nội dung chứa dạng xem ban đầu này và một số siêu dữ liệu khác nhau về chính phương thức. Tham khảo hướng dẫn tham khảo của chúng tôi để xem các đối tượng để xem danh sách đầy đủ các trường cần bao gồm.

Bố cục của một dạng xem được tạo bằng cách sử dụng các thành phần trực quan và tương tác của Block Kit - bao gồm các khối đầu vào đặc biệt để thu thập thông tin đầu vào của người dùng.

![alt text](./img/compossing.png)

Đây là một ví dụ đơn giản mà chúng tôi sẽ sử dụng:
```
{
	{
  "type": "modal",
  "callback_id": "modal-identifier",
  "title": {
    "type": "plain_text",
    "text": "Just a modal"
  },
  "blocks": [
    {
      "type": "section",
      "block_id": "section-identifier",
      "text": {
        "type": "mrkdwn",
        "text": "*Welcome* to ~my~ Block Kit _modal_!"
      },
      "accessory": {
        "type": "button",
        "text": {
          "type": "plain_text",
          "text": "Just a button",
        },
        "action_id": "button-identifier",
      }
    }
  ],
}
}

```
> Note :
Khi tạo chế độ xem, hãy đặt block_ids duy nhất cho tất cả các khối và action_ids duy nhất cho mỗi phần tử khối. Điều này sẽ giúp việc theo dõi các giá trị có thể có của các phần tử khối đó dễ dàng hơn nhiều khi chúng được trả về trong các trọng tải view_submission.

**3. Opening a modal**

Để mở một phương thức mới, ứng dụng của bạn phải có `trigger_id` hợp lệ, được lấy từ một trọng tải tương tác. Ứng dụng của bạn sẽ nhận được một trong những trọng tải này và do đó là `trigger_id`

Nếu ứng dụng của bạn không bật một trong những tính năng điểm nhập này, ứng dụng sẽ không thể mở một phương thức. Yêu cầu `trigger_id` đảm bảo rằng các phương thức chỉ xuất hiện khi ứng dụng có sự cho phép rõ ràng của người dùng.

> NOTE: Trigger_id sẽ hết hạn sau 3 giây kể từ khi được gửi đến ứng dụng của bạn.

Sau khi sở hữu trigger_id hợp lệ, chưa hết hạn, ứng dụng của bạn có thể gọi views.open với tải trọng chế độ xem mà bạn đã tạo ở trên:

```
POST https://slack.com/api/views.open
Content-type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
{
  "trigger_id": "156772938.1827394",
  "view": {
    "type": "modal",
    "callback_id": "modal-identifier",
    "title": {
      "type": "plain_text",
      "text": "Just a modal"
    },
    "blocks": [
      {
        "type": "section",
        "block_id": "section-identifier",
        "text": {
          "type": "mrkdwn",
          "text": "*Welcome* to ~my~ Block Kit _modal_!"
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Just a button"
          },
          "action_id": "button-identifier"
        }
      }
    ]
  }
}
```

Thao tác này sẽ mở ra một phương thức mới và hiển thị chế độ xem bạn đã soạn trong đó.

Nếu chế độ xem được mở mà không gặp sự cố, ứng dụng của bạn sẽ nhận được phản hồi có chứa giá trị `ok` được đặt thành true cùng với đối tượng chế độ xem được hiển thị cho người dùng.

Khi bạn nhận được phản hồi thành công này, bạn sẽ muốn lưu trữ view.id từ nó để lưu giữ an toàn. Điều này sẽ cho phép bạn cập nhật nội dung của chế độ xem đó sau này.
***
### Xử lý tương tác với modals

#### 1. Xử lý `block_actions` payloads

- Khi sử dụng [`interactive component`](https://api.slack.com/reference/block-kit/interactive-components) trong app's modal views, app sẽ nhận được [`block_actions(payload)`](https://api.slack.com/reference/interaction-payloads/block-actions)
- Điều này không áp dụng cho các thành phần có trong [`input(block)`](https://api.slack.com/reference/block-kit/blocks#input)
- Sau khi được xử lý, thông tin trong `block_actions` payload có thể được sử dụng để phản hồi tương tác.

#### 2. Xử lý `view_submission` payloads
- Khi một chế độ xem phương thức được gửi, bạn sẽ nhận được [`view_submission payload`](https://api.slack.com/reference/interaction-payloads/views#view_submission)
- payload chưa `state` object với các `values` và `contents` của bất kì khối trạng thái nào đã gửi trong `view`. Xem thêm [`view.state.values in the view_submission reference guide`](https://api.slack.com/reference/interaction-payloads/views#view_submission_fields) để hiểu cấu trúc của `state` object.
- Cũng giống như `block_actions` playloads, `view_submission` playloads có thể được sử dụng để phản hồi [`shown below.`](https://api.slack.com/surfaces/modals/using#response_actions)

#### 3. Xử lý `view_closed` payloads

- App của bạn có thể tùy chọn nhận [`view_closed payloads`](https://api.slack.com/reference/interaction-payloads/views#view_closed), bất cứ khi nào người dùng clicks Cancel hoặc X. Các buttons là tiêu chuẩn trong tất cả các app modals.
- Để nhận được `view_closed` payload, khi nhận được `view_closed` set `notify_on_close` bằng `true` khi tạo view với `views.open`, sẽ pushing một view mới  `views.push`, hoặc trong `response_action` [`shown below`](https://api.slack.com/surfaces/modals/using#response_actions).
***

### Update modals

- Updating a view
- Pushing new views
- Closing views
#### 1. Update a View
Có hai cách để **update view** trong một phương thức:

- Updating views via response_action
- Updating views via API

#### 2. Updating a view via `response_action`

Nếu ứng dụng của bạn vừa nhận được tải trọng `view_submission`, bạn có 3 giây để phản hồi và update view. Trả lời ứng dụng view đã cập nhật giá trị và view update

```
POST https://slack.com/api/views.update
Content-type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
{
  "view_id": "VIEW ID FROM VIEWS.OPEN RESPONSE",
  "hash": "156772938.1827394",
  "view": {
    "type": "modal",
    "callback_id": "view-helpdesk",
    "title": {
      "type": "plain_text",
      "text": "Submit an issue"
    },
    "submit": {
        "type": "plain_text",
         "text": "Submit"
    },
    "blocks": [
      {
        "type": "input",
        "block_id": "ticket-title",
        "label": {
          "type": "plain_text",
          "text": "Ticket title"
        },
        "element": {
          "type": "plain_text_input",
          "action_id": "ticket-title-value"
        }
      },
      {
        "type": "input",
        "block_id": "ticket-desc",
        "label": {
          "type": "plain_text",
          "text": "Ticket description"
        },
        "element": {
          "type": "plain_text_input",
          "multiline": true,
          "action_id": "ticket-desc-value"
        }
      }
    ]
  }
}
```
- _Phương pháp này chỉ hoạt động khi người dùng nhấn nút `submit` trong một chế độ xem, do đó, nó chỉ có thể được sử dụng để cập nhật chế độ xem hiện đang hiển thị._
[Xem chi tiết tại đây!](https://api.slack.com/surfaces/modals/using#getting_started)


####  3. Updating views via API

Hãy nhớ `view.id` đã được bao gồm trong phản hồi thành công khi bạn sử dụng `views.open `trước đó.

Bạn có thể cập nhật chế độ xem phương thức bằng cách gọi views.update. Bao gồm một chế độ xem mới được tạo và id của chế độ xem sẽ được cập nhật. Dạng xem mới này sẽ thay thế nội dung của dạng xem hiện có.

> Dữ liệu được nhập hoặc chọn trong các khối đầu vào có thể được giữ nguyên trong khi cập nhật chế độ xem. Đối tượng dạng xem mới mà bạn sử dụng với views.update phải chứa các khối và phần tử đầu vào giống nhau với các giá trị block_id và action_id giống hệt nhau.

```
POST https://slack.com/api/views.update
Content-type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
{
  "view_id": "VIEW ID FROM VIEWS.OPEN RESPONSE",
  "hash": "156772938.1827394",
  "view": {
    "type": "modal",
    "callback_id": "view-helpdesk",
    "title": {
      "type": "plain_text",
      "text": "Submit an issue"
    },
    "submit": {
        "type": "plain_text",
         "text": "Submit"
    },
    "blocks": [
      {
        "type": "input",
        "block_id": "ticket-title",
        "label": {
          "type": "plain_text",
          "text": "Ticket title"
        },
        "element": {
          "type": "plain_text_input",
          "action_id": "ticket-title-value"
        }
      },
      {
        "type": "input",
        "block_id": "ticket-desc",
        "label": {
          "type": "plain_text",
          "text": "Ticket description"
        },
        "element": {
          "type": "plain_text_input",
          "multiline": true,
          "action_id": "ticket-desc-value"
        }
      }
    ]
  }
}
```

Thời gian hoàn thành của view A và view B k giống nhau lên có thể xảy ra hiện tượng đua. Để ngăn chặn có một `hash` giá trị được bao gồm trong tất cả các `block_actions` trọng tải . Bạn có thể vượt qua `hash` khi gọi `views.update`. Nếu `hash` đã lỗi thời thì lệnh gọi API sẽ bị từ chối.

***
### Pushing a new view

Chế độ xem mới được đẩy sẽ ngay lập tức hiển thị cho người dùng. Khi người dùng đóng hoặc gửi chế độ xem mới này, họ sẽ quay lại chế độ xem tiếp theo trong ngăn xếp.

> Ứng dụng của bạn chỉ có thể xếp chồng 3 chế độ xem ( bao gồm cả chế độ xem ban đầu được sử dụng vớiviews.open ) trong một phương thức cùng một lúc.

Có hai cách để đẩy một chế độ xem vào ngăn xếp chế độ xem của một phương thức:
- Push view mới qua `response_action`
- Push view mới qua API

#### 1. Push view mới qua `response_action`

Nếu ứng dụng của bạn vừa nhận được một `view_submission` tải trọng , bạn có 3 giây để phản hồi và đẩy một chế độ xem mới. Trả lời ứng dụng yêu cầu HTTP với một `response_action` trường giá trị `push`, cùng với một trường mới được tạo view .

```
{
  "response_action": "push",
  "view": {
    "type": "modal",
    "title": {
      "type": "plain_text",
      "text": "Updated view"
    },
    "blocks": [
      {
        "type": "image",
        "image_url": "https://api.slack.com/img/blocks/bkb_template_images/plants.png",
        "alt_text": "Plants"
      },
      {
        "type": "context",
        "elements": [
          {
            "type": "mrkdwn",
            "text": "_Two of the author's cats sit aloof from the austere challenges of modern society_"
          }
        ]
      }
    ]
  }
}
```

#### 2. Pushing a new view via API

- `views.push `sẽ thêm một chế độ xem mới vào đầu ngăn xếp các chế độ xem hiện tại trong một phương thức.

- `views.push` yêu cầu `trigger_id` (tương tự như views.open) và chỉ có thể được gọi khi một phương thức đã được mở. Do đó, cách duy nhất có thể để có được `trigger_id` để sử dụng ở đây là sử dụng một thành phần tương tác trong phương thức.

> Lưu ý : trigger_id sẽ hết hạn sau 3 giây kể từ khi bạn nhận được,

```
POST https://slack.com/api/views.push
Content-type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
{
  "trigger_id": "YOUR TRIGGER ID",
  "view": {
    "type": "modal",
    "callback_id": "edit-task",
    "title": {
      "type": "plain_text",
      "text": "Edit task details"
    },
    "submit": {
    	"type": "plain_text",
        "text": "Create"
    },
    "blocks": [
      {
        "type": "input",
        "block_id": "edit-task-title",
        "label": {
          "type": "plain_text",
          "text": "Task title"
        },
        "element": {
          "type": "plain_text_input",
          "action_id": "task-title-value",
          "initial_value": "Block Kit documentation"
        },
      },
      {
        "type": "input",
        "block_id": "edit-ticket-desc",
        "label": {
          "type": "plain_text",
          "text": "Ticket description"
        },
        "element": {
          "type": "plain_text_input",
          "multiline": true,
          "action_id": "ticket-desc-value",
          "initial_value": "Update Block Kit documentation to include Block Kit in new surface areas (like modals)."
        }
      }
    ]
  }
}
```
- Chế độ xem được đẩy sẽ ngay lập tức hiển thị trên đầu chế độ xem đã gửi, thêm nó vào đầu ngăn xếp chế độ xem của phương thức. Khi người dùng gửi hoặc hủy chế độ xem hiện tại, họ sẽ quay lại chế độ xem trước đó trên ngăn xếp.

- Một phản hồi thành công từ `views.push` sẽ bao gồm `id` cho newly pushed view. `id` có ích nếu bạn cần [`update the view using views.update.`](https://api.slack.com/surfaces/modals/using#updating_apis).


#### 3. Đóng views

- Một ứng dụng có khả năng đóng các chế độ xem trong một phương thức. Điều này chỉ có thể xảy ra khi người dùng nhấp vào nút gửi trong phương thức, gửi [`view_submission payload.`](https://api.slack.com/surfaces/modals/using#handling_submissions).

##### Đóng view hiện tại

- Nếu ứng dụng của bạn phản hồi sự kiện view_submission với phản hồi xác nhận cơ bản - phản hồi HTTP 200 - điều này sẽ ngay lập tức đóng chế độ xem đã gửi và xóa nó khỏi ngăn xếp chế độ xem.

- Nếu không còn chế độ xem nào còn lại trong ngăn xếp, phương thức sẽ đóng. Nếu không, phương thức sẽ hiển thị chế độ xem tiếp theo trong ngăn xếp.

##### Close all views

- Nếu tất cả views của modal closed, set `response_action` to `clear`
```
{
  "response_action": "clear"
}
```
***
## Cấu hình cho bot

- Event subcriptions truy cập [Event subcriptions](https://api.slack.com/apps/A01J920DX8X/event-subscriptions?)
![Event subcriptions](./img/subcripts.png)

- Interactivity & Shortcuts truy cập [Interactivity](https://api.slack.com/apps/A01J920DX8X/interactive-messages?)
![Interactivity](./img/interactivity.png)

- Slack Command truy cập [Slack Command](https://api.slack.com/apps/A01J920DX8X/slash-commands?)
![cmd](./img/cmdnoti.png)

- Get tokenBOT tại [Bot User OAuth Access Token](https://api.slack.com/apps/A01K257T7GA/oauth)

- Các câu lệnh thao tác gọi sự kiện bot
```
            Settings calendar to Channel : /cal settings
            Show List calendar event : /cal all (views Edit,Delete event calendar)
            Add event calendar : /cal add-event
            Show event : /cal event
            If you want assistance please enter:  /cal --help
```

#### Systems settings
- Document
    - Phương thức: `views.open` [Tài liệu tham khảo](https://api.slack.com/methods/views.open)
    - Mô tả: Khi người dùng chưa có tài khoản Google hoặc Microsoft thì cần login để có thể show list calendar.
    - Câu lệnh gọi BOT : `/cal settings`
- Screenshorts

![alt text](./img/setting1.png)

- Code
```
const addCalendarToChannel = {
	"title": {
		"type": "plain_text",
		"text": "BOT NOTI CALENDARS ",
		"emoji": true
	},
	"submit": {
		"type": "plain_text",
		"text": "Submit",
		"emoji": true
	},
	"type": "modal",
	"close": {
		"type": "plain_text",
		"text": "Cancel",
		"emoji": true
	},
	"blocks": [
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": "System settings calendars",
				"emoji": true
			}
		},
		{
			"type": "section",
			"fields": [
				{
					"type": "plain_text",
					"text": "Google Account :",
					"emoji": true
				},
				{
					"type": "plain_text",
					"text": "Microsoft Account :",
					"emoji": true
				}
			]
		},
		{
			"type": "section",
			"fields": [
				{
					"type": "plain_text",
					"text": "xdatgd@gmail.com",
					"emoji": true
				},
				{
					"type": "plain_text",
					"text": "tuanna99qn@outlook.com",
					"emoji": true
				},
				{
					"type": "plain_text",
					"text": "googledemo1@gmail.com",
					"emoji": true
				},
				{
					"type": "plain_text",
					"text": "microsoftdemo1@outlook.com",
					"emoji": true
				},
				{
					"type": "plain_text",
					"text": "googledemo2@gmail.com",
					"emoji": true
				}
			]
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"emoji": true,
						"text": "Login Google"
					},
					"style": "primary",
					"action_id": "addGoogle"
				},
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"emoji": true,
						"text": "Login microsoft"
					},
					"style": "primary",
					"action_id": "addMicrosoft"
				}
			]
		},
		{
			"type": "input",
			"element": {
				"type": "checkboxes",
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "Calendar1",
							"emoji": true
						},
						"value": "value-0"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Calendar2",
							"emoji": true
						},
						"value": "value-1"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Calendar3",
							"emoji": true
						},
						"value": "value-2"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Calendar4",
							"emoji": true
						},
						"value": "value-3"
					}
				]
			},
			"label": {
				"type": "plain_text",
				"text": "List calendars :",
				"emoji": true
			}
		}
	]
}
```
#### Show list calendar
- Document
    - Phương Thức: `postMessage` [Tài liệu tham khảo](https://api.slack.com/methods/chat.postMessage)
    - Mô tả:Show tất cả các calendar mà của mình và calendar được chia sẻ
    - Câu lệnh gọi BOT : `/cal all`
- Screenshorts

![alt text](./img/listcalendar.png)

- Code
```
// blocks
const listCalendar = [
	{
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "*List calendar*"
		},
		"accessory": {
			"type": "radio_buttons",
			"initial_option": {
				"value": "value-0",
				"text": {
					"type": "plain_text",
					"text": "Calendar 1"
				}
			},
			"options": [
				{
					"text": {
						"type": "plain_text",
						"text": "Calendar 1",
						"emoji": true
					},
					"value": "value-0"
				},
				{
					"text": {
						"type": "plain_text",
						"text": "Calendar 2",
						"emoji": true
					},
					"value": "value-1"
				},
				{
					"text": {
						"type": "plain_text",
						"text": "Calendar 3",
						"emoji": true
					},
					"value": "value-2"
				}
			],
			"action_id": "radio_buttons-action"
		}
	},
	{
		"type": "actions",
		"elements": [
			{
				"type": "button",
				"text": {
					"type": "plain_text",
					"emoji": true,
					"text": "Show Calendar"
				},
				"style": "primary",
				"value": "buttonSubmit",
				"action_id": "buttonSubmit"
			}
		]
	}
]
```
#### Add event calendar
- Document:
    - Phương thức: `views.open` [Tài liệu tham khảo](https://api.slack.com/methods/views.open)
    - Mô Tả: Thực hiện chức năng tạo lịch theo ngày hoặc tạo lịch cả ngày
    - Câu lệnh gọi BOT : `/cal add-event`
- Screenshorts
    - Tạo lịch theo ngày

      ![alt text](./img/add-event.PNG)

    - Tạo lịch all day

      ![alt text](./img/all-day-event.PNG)


- Code
```

let timeStart =
{
	"type": "section",
	"text": {
		"type": "mrkdwn",
		"text": "Time start event"
	},
	"accessory": {
		"type": "timepicker",
		"initial_time": "13:30",
		"placeholder": {
			"type": "plain_text",
			"text": "Select time",
			"emoji": true
		},
		"action_id": "timepicker-action"
	}
}
let timeEnd =
{
	"type": "section",
	"text": {
		"type": "mrkdwn",
		"text": "Time end event"
	},
	"accessory": {
		"type": "timepicker",
		"initial_time": "14:00",
		"placeholder": {
			"type": "plain_text",
			"text": "Select time",
			"emoji": true
		},
		"action_id": "timepicker-action2"
	}
}

let dateEnd = {
	"type": "section",
	"text": {
		"type": "mrkdwn",
		"text": "Date end of the event all day "
	},
	"accessory": {
		"type": "datepicker",
		"initial_date": "2021-02-18",
		"placeholder": {
			"type": "plain_text",
			"text": "Date event at ",
			"emoji": true
		},
		"action_id": "datepicker-action1"
	}
}

const addEvent = {
	"title": {
		"type": "plain_text",
		"text": "BOT NOTI CALENDARS ",
		"emoji": true
	},
	"submit": {
		"type": "plain_text",
		"text": "Submit",
		"emoji": true
	},
	"type": "modal",
	"close": {
		"type": "plain_text",
		"text": "Cancel",
		"emoji": true
	},
	"blocks": [
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": "Edit event calendar",
				"emoji": true
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Calendar :"
			},
			"accessory": {
				"type": "users_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select a calendar",
					"emoji": true
				},
				"action_id": "users_select-action"
			}
		},
		{
			"type": "input",
			"element": {
				"type": "plain_text_input",
				"action_id": "plain_text_input-action"
			},
			"label": {
				"type": "plain_text",
				"text": "Edit a title",
				"emoji": true
			}
		},
		{
			"type": "section",
			"text": {
				"type": "plain_text",
				"text": " "
			},
			"accessory": {
				"type": "checkboxes",
				"action_id": "allday",
				"options": [
					{
						"value": "true",
						"text": {
							"type": "plain_text",
							"text": "All day"
						}
					}
				]
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Date of the event"
			},
			"accessory": {
				"type": "datepicker",
				"initial_date": "2021-02-18",
				"placeholder": {
					"type": "plain_text",
					"text": "Date event at ",
					"emoji": true
				},
				"action_id": "datepicker-action"
			}
		},
		{
			"type": "input",
			"element": {
				"type": "plain_text_input",
				"action_id": "plain_text_input-action"
			},
			"label": {
				"type": "plain_text",
				"text": "Location",
				"emoji": true
			}
		},
		{
			"type": "input",
			"element": {
				"type": "static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select an item",
					"emoji": true
				},
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "Every day",
							"emoji": true
						},
						"value": "value-0"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Every week",
							"emoji": true
						},
						"value": "value-1"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Every month",
							"emoji": true
						},
						"value": "value-2"
					}
				],
				"action_id": "static_select-action"
			},
			"label": {
				"type": "plain_text",
				"text": "Repeat",
				"emoji": true
			}
		},
		{
			"type": "input",
			"element": {
				"type": "static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select an item",
					"emoji": true
				},
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "At time of event",
							"emoji": true
						},
						"value": "value-0"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "15 minutes before",
							"emoji": true
						},
						"value": "value-1"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "30 minutes before",
							"emoji": true
						},
						"value": "value-2"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "1 hours before",
							"emoji": true
						},
						"value": "value-3"
					}
				],
				"action_id": "static_select-action"
			},
			"label": {
				"type": "plain_text",
				"text": "Remind me",
				"emoji": true
			}
		}
	]
}
```
#### Show list event

- Document:
    - Phương Thức: `postMessage` [Tài liệu tham khảo](https://api.slack.com/methods/chat.postMessage)
    - Mô tả: show ra tất cả các lịch cá nhân của mình và các lịch được chia sẻ
    - Câu lệnh gọi BOT : `/cal all` sau đó chọn calelendar muốn xem sự kiện
- Screenshorts

![alt text](./img/listevent.png)

```
const listEvent = [
	{
		"type": "header",
		"text": {
			"type": "plain_text",
			"text": "List event calendar",
			"emoji": true
		}
	},
	{
		"type": "section",
		"fields": [
			{
				"type": "mrkdwn",
				"text": "*Triển Khai dự án mới*"
			},
			{
				"type": "mrkdwn",
				"text": "1:00PM-2:00PM"
			},
			{
				"type": "mrkdwn",
				"text": "_phòng họp số 1_"
			},
			{
				"type": "mrkdwn",
				"text": "27-02-2021"
			}
		],
		"accessory": {
			"type": "button",
			"text": {
				"type": "plain_text",
				"text": "Edit",
				"emoji": true
			},
			"style": "primary",
			"value": "buttonUpdate",
			"action_id": "buttonUpdate"
		}
	},
	{
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "<https://example.com|View request>"
		}
	}
]
```

#### Update and Delete event
- Document
    - Phương thức: `views.open` [Tài liệu tham khảo](https://api.slack.com/methods/views.open)
    - Mô tả: Khi người dùng muốn thay chỉnh sửa thay đổi hoặc xóa event.
    - Câu lệnh gọi BOT : `/cal all` sau đó chọn sự kiện để tùy chọn thay đổi.
- Screenshorts

![alt text](./img/editEvent.png)

- Code
```

const editEvent = {
	"type": "modal",
	"title": {
		"type": "plain_text",
		"text": "My App",
		"emoji": true
	},
	"submit": {
		"type": "plain_text",
		"text": "Submit",
		"emoji": true
	},
	"close": {
		"type": "plain_text",
		"text": "Cancel",
		"emoji": true
	},
	"blocks": [
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": "Edit event calendar",
				"emoji": true
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Calendar :"
			},
			"accessory": {
				"type": "users_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select a calendar",
					"emoji": true
				},
				"action_id": "users_select-action"
			}
		},
		{
			"type": "input",
			"element": {
				"type": "plain_text_input",
				"action_id": "plain_text_input-action"
			},
			"label": {
				"type": "plain_text",
				"text": "Edit a title",
				"emoji": true
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Date of the event"
			},
			"accessory": {
				"type": "datepicker",
				"initial_date": "2021-02-18",
				"placeholder": {
					"type": "plain_text",
					"text": "Date event at ",
					"emoji": true
				},
				"action_id": "datepicker-action"
			}
		},
		{
			"type": "input",
			"element": {
				"type": "plain_text_input",
				"action_id": "plain_text_input-action"
			},
			"label": {
				"type": "plain_text",
				"text": "Location",
				"emoji": true
			}
		},
		{
			"type": "input",
			"element": {
				"type": "static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select an item",
					"emoji": true
				},
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "Every day",
							"emoji": true
						},
						"value": "value-0"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Every week",
							"emoji": true
						},
						"value": "value-1"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Every month",
							"emoji": true
						},
						"value": "value-2"
					}
				],
				"action_id": "static_select-action"
			},
			"label": {
				"type": "plain_text",
				"text": "Repeat",
				"emoji": true
			}
		},
		{
			"type": "input",
			"element": {
				"type": "static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select an item",
					"emoji": true
				},
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "At time of event",
							"emoji": true
						},
						"value": "value-0"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "15 minutes before",
							"emoji": true
						},
						"value": "value-1"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "30 minutes before",
							"emoji": true
						},
						"value": "value-2"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "1 hours before",
							"emoji": true
						},
						"value": "value-3"
					}
				],
				"action_id": "static_select-action"
			},
			"label": {
				"type": "plain_text",
				"text": "Remind me",
				"emoji": true
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Do you want to delete event?"
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "Delete",
					"emoji": true
				},
				"style": "danger",
				"value": "buttonDelete",
				"action_id": "buttonDelete"
			}
		}
	]
}

const deleteEvent = {
	"title": {
		"type": "plain_text",
		"text": "BOT NOTI CALENDARS",
		"emoji": true
	},
	"type": "modal",
	"close": {
		"type": "plain_text",
		"text": "Close",
		"emoji": true
	},
	"blocks": [
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"emoji": true,
						"text": "YES"
					},
					"style": "primary",
					"action_id": "buttonUpdate"
				},
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"emoji": true,
						"text": "NO !"
					},
					"style": "danger",
					"action_id": "buttonDelete"
				}
			]
		}
	]
}
```

***
- Tài liệu tham khảo về  Block Kit Builder: [Block Kit Builder](https://app.slack.com/block-kit-builder/T01K2DCCVPB#%7B%22blocks%22:%5B%7B%22type%22:%22divider%22%7D,%7B%22type%22:%22divider%22%7D,%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22This%20is%20a%20section%20block%20with%20an%20accessory%20image.%22%7D,%22accessory%22:%7B%22type%22:%22image%22,%22image_url%22:%22https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg%22,%22alt_text%22:%22cute%20cat%22%7D%7D%5D%7D)