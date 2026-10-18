# Part 派工、审核与推进

## 找到本轮可执行动作

按 SKILL.md 和读取约定确定本角色/模式的必读范围，确认权威治理来源。用户交付摘要和代码定位是审核导航，不替代原文证据。可先用 inputs 列出当前文件与版本；不用把全部历史输出给模型。

| 磁盘证据 | 下一动作 |
|---|---|
| 无认可的项目书/范围 | 完成规划与基线 |
| 当前 Part 无 prompt | 核对依赖，生成该 Part 第一个可执行任务 prompt |
| prompt 已存但未确认送达 | 转发/核对送达；保持 `ARCHIVED_NOT_SENT` |
| 已送达无交付 | 继续已有任务或等待；不重复创建任务 |
| 有交付无 review | 独立审核，状态 `REVIEW_REQUIRED` |
| review 为 `CONDITIONAL_PASS` / `FAIL` | 原 Part 原角色补正，追加 revision 编号 |
| 技术通过但未合入 | `TECHNICALLY_ACCEPTED`，按授权集成并主线复验 |
| 实现已在主线、缺最终 review | 复验并补写最终 review；不重复合并 |
| 角色 PASS、同一 Part 前置/主体还有未完成 | 派当前 Part 剩余可执行任务，不递增 Part |
| 整个 Part 通过、台账未更新 | 核对整个 Part review 后只补台账 |
| 当前 Part 全部通过且状态一致 | 若获准继续，生成下一个 Part prompt |

此表对每个任务分别判断，不把互不依赖的同 Part 工作强行串行化。先处理解除依赖的前置；已获授权的独立任务按读取约定安全并行，状态推进与集成由总控串行控制。

## 先归档完整 prompt

使用 [part-prompt.md](../assets/part-prompt.md)，包含项目根/治理来源、完整必读清单、计划版本、Part/任务/角色、Git 基线与已过前置、允许/禁止路径、接口契约、输入输出、异常/资源/隐私边界、需要复用的能力、验收映射、退出条件与交付格式。基线从现场 Git 得到，不沿用旧聊天哈希；环境路径探测后写入当前设备定位，不将本机路径成为公共默认值。

区分硬性接口/兼容约束和建议实现，方法建议允许角色在范围内调整并交代理由。只在正确性确实依赖调用顺序时固定步骤。派工前按读取约定复核新鲜度；不能预填“已经全文读过”或“前置通过”作为模板事实。

先保存完整 `prompt-<role>.md`；同一 Part 同角色多个任务加任务 ID 后缀。接收者可读共享文件时发送角色/任务、权威根定位及正式 prompt 路径，并要求先读取原文；无法读文件则发送完整原文。都须确认送达及读取结果，不把文件存在或任务 ID 当作执行成功。尚未轮到的角色用 [role-start.md](../assets/role-start.md) 初始化等待。

跨角色前置保留当前 Part：归档 [change-request.md](../assets/change-request.md)，明确阻断哪个任务；向文件所有者派发前置 prompt。前置独立审核、合入、主线复验后才生成/重发依赖它的主体 prompt。非阻断问题明确最迟关闭任务，不一律阻断无关工作，也不丢失。

## 交付与独立审核

实现者按 [delivery.md](../assets/delivery.md) 归档：基线→最终提交、工作树、准确修改范围、接口/语义、风险位置、实际命令/配置/二进制来源/退出码/最终日志、未验证项和 CR。报告写入 prompt 明确授权的位置；没有写入权时回传完整文本由总控归档。共享文件可读时只回传精简审核请求和报告路径，总控仍读取完整交付、实际 diff 与所需源文件。

总控读 [verification.md](verification.md)，按原 prompt 逐项检查，采用 [review.md](../assets/review.md) 记录。部长有下级时先审下级，总控再审部门，不能自审自批。结论：

- `CONDITIONAL_PASS`：主体已有成果，但存在必须补正项；绝不放行。
- `FAIL`：关键功能/证据缺失、失败或越界；原 Part 纠正。
- `TECHNICALLY_ACCEPTED`：技术审核通过，尚待集成与主线验证；绝不当作最终 PASS。
- `PASS`：独立审核通过、代码进入主线、必要主线验证通过，证据已归档。

尚未合入时先写技术 review，合入后追加 `review-<role>-integration.md`；如果第一次写 review 前已完成完整审核、获准合入与主线复验，可用一份最终 review 收齐全部证据，不强制重复文件。既有文件不改写。集成复审再次失败时追加编号文件。

每项补正使用稳定问题 ID，写清反例、期望、影响、允许改动和回归要求，收窄范围。旧问题修复后有新缺陷，关闭旧 ID、追加新 ID，再发同一 Part 下一轮 revision；不把“补正做完了”当作自动通过。同一 Part 补正优先沿用现有分支追加提交，是否新工作树取决于真实基线与隔离需求。

## 整个 Part 与里程碑门禁

当前 Part 配置中所有任务（包括后来获准加入的前置任务）最终 PASS 后，写 [review-part.md](../assets/review-part.md) 汇总准确任务集合、最终角色 review、主线 SHA，以及本 Part 到期里程碑验收。使用 [里程碑模板](../assets/milestone.md)，每个里程碑开始前在 `progress/Milestone-NN/prompt-milestone.md` 冻结跨模块场景、质量阈值、所含 Part；到期写 `review-milestone.md`，失败同样追加补正文件。各 Part 单测通过不等于里程碑通过。

之后才更新 STATUS：追加一个完成 Part 索引，`last_completed_part = N`，`next_part = N+1`，清空已完成的 active_items。先有 review 再有状态。治理文档与实现提交可分开归档：review 引用被测实现 SHA，治理提交无需引用自身尚不存在的 SHA。若用户只要求本 Part 审核，报告下一个 Part 未开始，不自动派发。

状态字段、JSON 示例和检查器约定见 [state-format.md](state-format.md)；已掌握且版本未变时不重复载入。首次写状态或遇到字段错误时读取原文。
