# {{项目名}} 最终验收

先在 `progress/Final/prompt-acceptance.md` 冻结以下验收场景，执行后另存 review，不提前写成功。

| 项目书需求ID | 最终制品/版本 | 用户操作和预期 | 实际证据 | 结论 |
|---|---|---|---|---|
| {{ID}} | {{制品}} | {{场景}} | {{结果}} | {{通过/未通过/未验证}} |

环境：{{实际设备/操作系统/依赖/干净安装，未实测平台}}。
交付：{{启动、安装、升级、回退说明；源码、版本、许可与制品校验}}。
数据：{{导出、删除、备份/恢复等适用验证}}。
遗留：{{范围内阻断/已认可非阻断、责任和处理建议}}。
用户验收：{{实际确认或事先委托的客观验收方式及执行记录路径}}。

```json
{
  "kind": "project",
  "decision": "CONDITIONAL_PASS",
  "prompt": "progress/Final/prompt-acceptance.md",
  "primary_commit": null,
  "checks": [],
  "requirements_verified": false,
  "blocking_issues": ["尚未完成最终验收"],
  "user_acceptance": null
}
```

全部实际成立后才填 PASS，更新 STATUS 为 COMPLETE；最后一个 Part 通过但用户验收待定时保持 READY_FOR_ACCEPTANCE。checks 结构同角色 review。
