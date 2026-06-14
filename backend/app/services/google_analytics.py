import os
import json
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange,
    Dimension,
    Metric,
    RunReportRequest,
    OrderBy
)
from google.oauth2 import service_account
from fastapi import HTTPException

class GoogleAnalyticsService:
    SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]

    @classmethod
    def _get_client(cls):
        """
        Loads credentials from backend/service_account.json and initializes the client.
        """
        cred_path = os.path.join(os.getcwd(), "service_account.json")
        
        if not os.path.exists(cred_path):
            alt_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "service_account.json")
            if os.path.exists(alt_path):
                cred_path = alt_path
            else:
                raise HTTPException(
                    status_code=400, 
                    detail="Google Service Account key (service_account.json) missing."
                )
        
        try:
            with open(cred_path, "r") as f:
                creds_data = json.load(f)
            
            subject = creds_data.get("analytics_email")
            if subject and (subject.strip().lower().endswith("@gmail.com") or "@" not in subject):
                subject = None
            
            credentials = service_account.Credentials.from_service_account_file(
                cred_path, 
                subject=subject,
                scopes=cls.SCOPES
            )
            return BetaAnalyticsDataClient(credentials=credentials)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to initialize GA4 client: {str(e)}")

    @classmethod
    async def get_basic_stats(cls, property_id: str, start_date: str = "30daysAgo", end_date: str = "today"):
        """
        Fetches basic traffic stats (Active Users, New Users, Sessions, Page Views).
        """
        client = cls._get_client()
        
        try:
            request = RunReportRequest(
                property=f"properties/{property_id}",
                dimensions=[Dimension(name="date")],
                metrics=[
                    Metric(name="activeUsers"),
                    Metric(name="newUsers"),
                    Metric(name="sessions"),
                    Metric(name="screenPageViews"),
                    Metric(name="bounceRate")
                ],
                date_ranges=[DateRange(start_date=start_date, end_date=end_date)],
            )
            
            response = client.run_report(request)
            
            # Aggregate totals
            totals = {
                "activeUsers": 0,
                "newUsers": 0,
                "sessions": 0,
                "screenPageViews": 0,
                "avgBounceRate": 0
            }
            
            rows_count = len(response.rows)
            for row in response.rows:
                totals["activeUsers"] += int(row.metric_values[0].value)
                totals["newUsers"] += int(row.metric_values[1].value)
                totals["sessions"] += int(row.metric_values[2].value)
                totals["screenPageViews"] += int(row.metric_values[3].value)
                totals["avgBounceRate"] += float(row.metric_values[4].value)
                
            if rows_count > 0:
                totals["avgBounceRate"] = round((totals["avgBounceRate"] / rows_count) * 100, 2)
            
            return totals
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching GA4 report: {str(e)}")

    @classmethod
    async def get_traffic_sources(cls, property_id: str, start_date: str = "30daysAgo", end_date: str = "today"):
        """
        Fetches sessions by first user medium (Source/Channel distribution).
        """
        client = cls._get_client()
        
        try:
            request = RunReportRequest(
                property=f"properties/{property_id}",
                dimensions=[Dimension(name="sessionMedium")],
                metrics=[Metric(name="sessions")],
                date_ranges=[DateRange(start_date=start_date, end_date=end_date)],
                order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="sessions"), desc=True)]
            )
            
            response = client.run_report(request)
            
            sources = []
            total_sessions = 0
            
            for row in response.rows:
                sessions = int(row.metric_values[0].value)
                sources.append({
                    "name": row.dimension_values[0].value,
                    "sessions": sessions
                })
                total_sessions += sessions
                
            # Calculate percentages
            for s in sources:
                s["share"] = round((s["sessions"] / total_sessions * 100), 1) if total_sessions > 0 else 0
                
            return {
                "sources": sources,
                "total_sessions": total_sessions
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching GA4 sources: {str(e)}")

    @classmethod
    async def get_regional_stats(cls, property_id: str, start_date: str = "30daysAgo", end_date: str = "today"):
        """
        Fetches sessions by country.
        """
        client = cls._get_client()
        
        try:
            request = RunReportRequest(
                property=f"properties/{property_id}",
                dimensions=[Dimension(name="country")],
                metrics=[Metric(name="activeUsers")],
                date_ranges=[DateRange(start_date=start_date, end_date=end_date)],
                order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="activeUsers"), desc=True)],
                limit=10
            )
            
            response = client.run_report(request)
            
            regions = []
            for row in response.rows:
                regions.append({
                    "country": row.dimension_values[0].value,
                    "users": int(row.metric_values[0].value)
                })
                
            return regions
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching GA4 regional stats: {str(e)}")


