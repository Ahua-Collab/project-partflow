# Part-{{NN}} {{角色}} 第{{轮次}}轮审核

正式 prompt/此前 review：{{准确路径}}；审核者：{{独立于实现者}}。

## 实际证据

读取的治理版本、源基线及完整提交链、实际 diff/文件、公共接口与关键实现、独立执行的命令/配置/构建目录/最终日志；越界检查；隐私/迁移/依赖影响。原 SHA→主线 SHA 与等价/祖先核验方法。技术审查尚未合入时明确说明。

## 逐项验收与问题

| 需求/问题ID | 预期 | 独立证据/反例 | 结论/剩余责任 |
|---|---|---|---|
| {{ID}} | {{要求}} | {{事实}} | {{已关闭/开放}} |

{{区分已运行、未运行、环境阻碍、合成样例与真实效果。新问题追加ID。解释非阻断遗留为何可留、负责人及最迟关闭点。}}

{{关键结论对应需求/问题ID及原文/代码/运行证据、版本；推断不记为实测。注明本次必跑、同条件复用和不适用检查及理由。放行前复核治理版本、被审提交和主线未发生未审查变化。必需证据缺失不得 PASS。}}

## 下一动作

{{同一 Part 补正/待授权集成/同一 Part 下一任务/可收口本 Part}}。不得提前填成功。下列 JSON 是未完成模板，最终 PASS 时才填有效 SHA、至少一条实际主线检查和 true，并清空确已关闭的阻断项。

```json
{
  "kind": "task",
  "task_id": "{{任务ID}}",
  "part": 1,
  "role": "{{角色ID}}",
  "reviewer": "director",
  "decision": "CONDITIONAL_PASS",
  "prompt": "{{完整prompt路径}}",
  "source_commit": null,
  "primary_commit": null,
  "checks": [],
  "acceptance_checked": false,
  "scope_checked": false,
  "blocking_issues": ["{{尚未关闭的问题ID}}"]
}
```

checks 每项为 `{command, exit_code, log, commit}`；log 是已归档相对路径，commit 是实际被测主线完整 SHA。part 填实际工作单元编号，不能保留模板的 1。
