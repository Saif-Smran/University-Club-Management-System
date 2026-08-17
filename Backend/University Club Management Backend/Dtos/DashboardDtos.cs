namespace University_Club_Management_Backend.Dtos;

public class AdminDashboardDto
{
    public int TotalUsers { get; set; }
    public int TotalStudents { get; set; }
    public int PendingStudentVerifications { get; set; }
    public int TotalClubs { get; set; }
    public int PendingClubApplications { get; set; }
    public int TotalEvents { get; set; }
    public int TotalActiveMemberships { get; set; }
}

public class ClubAdminDashboardDto
{
    public int ManagedClubsCount { get; set; }
    public int TotalClubMembers { get; set; }
    public int PendingMembershipApplications { get; set; }
    public int UpcomingEventsCount { get; set; }
    public int TotalAnnouncementsCount { get; set; }
    public List<ClubDto> ManagedClubs { get; set; } = new();
}

public class StudentDashboardDto
{
    public int JoinedClubsCount { get; set; }
    public int UpcomingRegisteredEventsCount { get; set; }
    public int PendingClubApplicationsCount { get; set; }
    public bool IsStudentVerified { get; set; }
    public string VerificationStatus { get; set; } = "Pending";
    public List<ClubDto> JoinedClubs { get; set; } = new();
}
