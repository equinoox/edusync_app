CREATE INDEX "quiz_attempt_student_status_submitted_at_idx" ON "quiz_attempts" USING btree ("student_id","status","submitted_at");
