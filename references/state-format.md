# 状态格式 v2（仅需要生成、修改或核对字段时读取）

新项目使用 schema_version: 2，进度目录默认 progress。检查器不会把旧格式当作新项目；迁移与保留历史的方法见 [recovery.md](recovery.md)。

使用模板中的单个 `json` 围栏。`.engineering/project.json` 的 `tasks` 每项为 `{id, part, owner, depends_on}`，连续 Part 从 1 开始；`milestones` 每项为 `{id, end_part, prompt}`。计划变更先在项目书解释，再同步配置；状态不能自行新增计划任务。

STATUS 中 `completed_parts` 只存 `{part, review, primary_commit}` 索引；历史细节在 Part 文件里。`active_items` 是任务 ID 到 `{status, prompt, review, delivery}` 的映射，只能属于 `next_part`。状态允许 `NOT_STARTED`、`ARCHIVED_NOT_SENT`、`IN_PROGRESS`、`REVIEW_REQUIRED`、`CONDITIONAL_PASS`、`FAIL`、`TECHNICALLY_ACCEPTED`、`PASS`、`BLOCKED`；未执行任务可不放入 active_items。同一 Part 依赖任务开始前，其前置 active item 必须 PASS 且有最终 review。

`open_issues` 只列尚未关闭的问题，每项为 `{id, owner, due_part, blocks}`：`blocks` 是立即阻断的任务 ID 列表，`due_part` 是必须在该 Part 最终通过前关闭的期限。非阻断遗留可暂为空 blocks，但到期不能放行。关闭后将完整依据留在 review 并从活跃清单移除；获用户认可的交付限制存最终报告，不假装技术问题已经修复。

每份最终角色 review 的 JSON 必须含 `kind: task`、`task_id`、`part`、`role`、`reviewer`、`decision`、`prompt`、`source_commit`、`primary_commit`、`checks`、`acceptance_checked`、`scope_checked`、`blocking_issues`。`checks` 至少有一个实际主线检查 `{command, exit_code: 0, log, commit}`，commit 与 primary_commit 一致，log 为项目内证据文件；文档 Part 可记录实际文档一致性检查及输出，不虚构编译。受阻的检查另列未验证，必需项受阻时不能 PASS。

整个 Part review 是 `kind: part`，包含 `part`、`decision`、`primary_commit`、`tasks: [{id, review}]`、`milestone_reviews: [{id, review}]`。里程碑 review 是 `kind: milestone`、`id`、`decision`、`prompt`、`primary_commit`、`checks`。最终项目 review 见 verification。这些字段让脚本发现缺证据与跳 Part，不能代替审阅者判断。

已有项目格式不匹配时先人工核验原治理；不能为了脚本通过覆盖旧记录。获准迁移时新增带来源引用的转换说明与索引，缺失证据保留缺失，不能追认虚假的 PASS。
