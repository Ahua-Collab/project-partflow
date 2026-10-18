# Part 进度记录约定

Part 是逻辑工作单元；一天现实时间可以完成多个 Part，一个 Part 也可跨多个现实日。目录只用 `Part-01`、`Part-02` 等连续编号。唯一进度入口为 STATUS.md，配置保存计划而非执行状态。

总控开始新 Part 前按 AGENTS 的读取规则核对权威项目书/规则、本文件、STATUS、上个 Part 原始/补正 prompt 与最终 review、当前记录、开放 CR 和 Git。首次接手/恢复及里程碑/最终验收完整重读治理；连续 Part 仅在当前上下文保有完整原文、来源一致且实际哈希未变时复用。实现角色按正式 prompt 的本模块清单读取；旧工作树副本不可替代最新治理，压缩/交接/变化/不确定时重读，既有更严规则优先。

记录：`prompt-角色.md`、`delivery-角色.md`、`review-角色.md`；补正为 `prompt/review-角色-revision-01.md` 递增；需要分离集成审核时追加 `review-角色-integration.md`。同一 Part 同角色不同任务在角色后加任务 ID。整个 Part 最终门禁为 `review-part.md`，后续纠错追加编号文件。里程碑有预先 prompt 和独立 review；最终用户验收放在 Final/。

状态：NOT_STARTED 未开始；ARCHIVED_NOT_SENT 已归档未送达；IN_PROGRESS 已派发；REVIEW_REQUIRED 已交付待审；CONDITIONAL_PASS 必须補正；FAIL 未通过；TECHNICALLY_ACCEPTED 技术通过待集成；PASS 已审核合入复验；BLOCKED 当前动作受阻。

PASS 必须有实际证据；前置、主体和本 Part 到期里程碑均通过才能加一。所有 prompt/review 追加归档，不覆盖历史。治理维护、续接、补正与 CR 不凭空增加 Part。先写 review 再更新 STATUS；已合入未记账时对账，禁止再次合入。

失败与未知分别记录。未验证项注明负责人及最迟关闭点。实现角色只交付，总控独立审核；“测试全绿”不等于需求满足。检查器不可用时人工执行相同核验并记录缺失，不虚报自动检查通过。
