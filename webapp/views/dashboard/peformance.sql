select date_trunc('minute', s.created_at) as timestamp, s.created_by_uid, count(*)
FROM sample s
GROUP BY s.created_by_uid, date_trunc('minute',s.created_at)
ORDER BY s.created_by_uid, date_trunc('minute',s.created_at)

select to_timestamp(floor((extract('epoch' from s.created_at)/60)) * 60) AT TIME ZONE 'UTC' as timestamp, s.created_by_uid, COUNT(*)
FROM sample s 
GROUP BY to_timestamp(floor((extract('epoch' from s.created_at)/60)) * 60), s.created_by_uid
ORDER BY s.created_by_uid, to_timestamp(floor((extract('epoch' from s.created_at)/60)) * 60)

SELECT
    TIMESTAMP 'epoch' + INTERVAL '1 second' * floor(extract('epoch' from s.created_at) / 60) * 60 as timestamp,
    s.created_by_uid,
    count(*)
FROM sample s
GROUP BY floor(extract('epoch' from s.created_at) / 60), s.created_by_uid
ORDER BY s.created_by_uid, floor(extract('epoch' from s.created_at) / 60)


SELECT series.minute as interval, cnt.created_by_uid,coalesce(cnt.x,0) as count from 
   (
	select to_timestamp(floor((extract('epoch' from s.created_at)/60)) * 60) AT TIME ZONE 'UTC' as timestamp, s.created_by_uid, COUNT(*) as x
	FROM sample s 
	GROUP BY floor(extract('epoch' from s.created_at) / 60), s.created_by_uid
   ) cnt
RIGHT JOIN 
   (    
   SELECT generate_series(min(date_trunc('hour',s.created_at)),
   max(date_trunc('minute',s.created_at)),'1m') as minute from sample s 
   ) series on series.minute = cnt.timestamp
ORDER BY series.minute