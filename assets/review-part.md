# Part-{{NN}} 整个 Part 门禁

{{按项目书核对该 Part 所有必需前置、主体、补正和到期里程碑；引用各角色最终review。不得用一个角色PASS代表整个 Part。}}

```json
{
  "kind": "part",
  "part": 1,
  "decision": "CONDITIONAL_PASS",
  "primary_commit": null,
  "tasks": [],
  "milestone_reviews": []
}
```

tasks 项为 `{id, review}`，覆盖本 Part 配置中的全部任务；milestone_reviews 项同形，覆盖 end_part 为本 Part 的全部里程碑。通过后填写真实主线 SHA 和 PASS，再将该报告路径/SHA加入 STATUS；不得覆盖此前失败的整个 Part 报告。
