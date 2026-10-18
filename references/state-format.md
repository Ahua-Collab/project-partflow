# ״̬��ʽ v2������Ҫ���ɡ��޸Ļ�˶��ֶ�ʱ��ȡ��

����Ŀʹ�� schema_version: 2������Ŀ¼Ĭ�� progress�����������Ѿɸ�ʽ��������Ŀ��Ǩ���뱣����ʷ�ķ����� [recovery.md](recovery.md)��

ʹ��ģ���еĵ��� `json` Χ����`.engineering/project.json` �� `tasks` ÿ��Ϊ `{id, part, owner, depends_on}`������ Part �� 1 ��ʼ��`milestones` ÿ��Ϊ `{id, end_part, prompt}`���ƻ����������Ŀ����ͣ���ͬ�����ã�״̬�������������ƻ�����

STATUS �� `completed_parts` ֻ�� `{part, review, primary_commit}` ��������ʷϸ���� Part �ļ��`active_items` ������ ID �� `{status, prompt, review, delivery}` ��ӳ�䣬ֻ������ `next_part`��״̬���� `NOT_STARTED`��`ARCHIVED_NOT_SENT`��`IN_PROGRESS`��`REVIEW_REQUIRED`��`CONDITIONAL_PASS`��`FAIL`��`TECHNICALLY_ACCEPTED`��`PASS`��`BLOCKED`��δִ������ɲ����� active_items��ͬһ Part ��������ʼǰ����ǰ�� active item ���� PASS �������� review��

`open_issues` ֻ����δ�رյ����⣬ÿ��Ϊ `{id, owner, due_part, blocks}`��`blocks` ��������ϵ����� ID �б���`due_part` �Ǳ����ڸ� Part ����ͨ��ǰ�رյ����ޡ��������������Ϊ�� blocks�������ڲ��ܷ��С��رպ������������� review ���ӻ�Ծ�嵥�Ƴ������û��ϿɵĽ������ƴ����ձ��棬����װ���������Ѿ��޸���

ÿ�����ս�ɫ review �� JSON ���뺬 `kind: task`��`task_id`��`part`��`role`��`reviewer`��`decision`��`prompt`��`source_commit`��`primary_commit`��`checks`��`acceptance_checked`��`scope_checked`��`blocking_issues`��`checks` ������һ��ʵ�����߼�� `{command, exit_code: 0, log, commit}`��commit �� primary_commit һ�£�log Ϊ��Ŀ��֤���ļ����ĵ� Part �ɼ�¼ʵ���ĵ�һ���Լ�鼰��������鹹���롣����ļ������δ��֤������������ʱ���� PASS��

���� Part review �� `kind: part`������ `part`��`decision`��`primary_commit`��`tasks: [{id, review}]`��`milestone_reviews: [{id, review}]`����̱� review �� `kind: milestone`��`id`��`decision`��`prompt`��`primary_commit`��`checks`��������Ŀ review �� verification����Щ�ֶ��ýű�����ȱ֤������ Part�����ܴ����������жϡ�

������Ŀ��ʽ��ƥ��ʱ���˹�����ԭ����������Ϊ�˽ű�ͨ�����Ǿɼ�¼����׼Ǩ��ʱ��������Դ���õ�ת��˵����������ȱʧ֤�ݱ���ȱʧ������׷����ٵ� PASS��
