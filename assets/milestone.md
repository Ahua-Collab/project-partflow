# {{里程碑ID}} 端到端门禁

开始前将目标写入 `progress/Milestone-NN/prompt-milestone.md`：

- 所含 Part/任务/角色：{{准确集合}}；截止 Part：{{N}}。
- 跨模块输入→操作→输出：{{真实演示路径}}。
- 必需阈值与失败/恢复场景：{{指标、平台和数据边界}}。
- 允许遗留及理由：{{不替代必需验收}}。
- 验收方法和制品：{{实际命令、演示与证据形式}}。

交付后另写 `review-milestone.md`：引用最终角色/整个 Part review 和主线提交，逐项填实际证据；合成演示与真实目标分别说明，未通过则同里程碑编号补正，不启动下阶段。

```json
{
  "kind": "milestone",
  "id": "{{里程碑ID}}",
  "decision": "CONDITIONAL_PASS",
  "prompt": "{{预先归档的里程碑prompt路径}}",
  "primary_commit": null,
  "checks": []
}
```

实际满足全部要求后才填 PASS、完整 SHA 和非空 checks；检查项结构同角色 review。
