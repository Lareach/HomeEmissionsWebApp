using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Co2HomeEmissionsTP36.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "category",
                columns: table => new
                {
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    Uid = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_category", x => x.CategoryId);
                });

            migrationBuilder.CreateTable(
                name: "concession",
                columns: table => new
                {
                    ConcessionId = table.Column<int>(type: "int", nullable: false),
                    Uid = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ConcessionName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_concession", x => x.ConcessionId);
                });

            migrationBuilder.CreateTable(
                name: "energy",
                columns: table => new
                {
                    EnergyId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EnergyName = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    EnergyContentFactor = table.Column<double>(type: "float", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_energy", x => x.EnergyId);
                });

            migrationBuilder.CreateTable(
                name: "savings",
                columns: table => new
                {
                    SavingsId = table.Column<int>(type: "int", nullable: false),
                    Uid = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Method = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Duration = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    EligibilityRequirements = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CtaUrl = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CategoryId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_savings", x => x.SavingsId);
                    table.ForeignKey(
                        name: "FK_savings_category_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "category",
                        principalColumn: "CategoryId");
                });

            migrationBuilder.CreateTable(
                name: "emissionFactor",
                columns: table => new
                {
                    FactorId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ScopeOneEmission = table.Column<double>(type: "float", nullable: true),
                    ScopeTwoEmission = table.Column<double>(type: "float", nullable: true),
                    ScopeThreeEmission = table.Column<double>(type: "float", nullable: true),
                    EnergyId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_emissionFactor", x => x.FactorId);
                    table.ForeignKey(
                        name: "FK_emissionFactor_energy_EnergyId",
                        column: x => x.EnergyId,
                        principalTable: "energy",
                        principalColumn: "EnergyId");
                });

            migrationBuilder.CreateTable(
                name: "energyConsumption",
                columns: table => new
                {
                    ConsumptionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Year = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    HouseholdNum = table.Column<int>(type: "int", nullable: true),
                    EmissionAmount = table.Column<double>(type: "float", nullable: true),
                    EnergyId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_energyConsumption", x => x.ConsumptionId);
                    table.ForeignKey(
                        name: "FK_energyConsumption_energy_EnergyId",
                        column: x => x.EnergyId,
                        principalTable: "energy",
                        principalColumn: "EnergyId");
                });

            migrationBuilder.CreateTable(
                name: "savingsConcession",
                columns: table => new
                {
                    SavingsId = table.Column<int>(type: "int", nullable: false),
                    ConcessionId = table.Column<int>(type: "int", nullable: false),
                    Uid = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_savingsConcession", x => new { x.SavingsId, x.ConcessionId });
                    table.ForeignKey(
                        name: "FK_savingsConcession_concession_ConcessionId",
                        column: x => x.ConcessionId,
                        principalTable: "concession",
                        principalColumn: "ConcessionId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_savingsConcession_savings_SavingsId",
                        column: x => x.SavingsId,
                        principalTable: "savings",
                        principalColumn: "SavingsId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_emissionFactor_EnergyId",
                table: "emissionFactor",
                column: "EnergyId");

            migrationBuilder.CreateIndex(
                name: "IX_energyConsumption_EnergyId",
                table: "energyConsumption",
                column: "EnergyId");

            migrationBuilder.CreateIndex(
                name: "IX_savings_CategoryId",
                table: "savings",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_savingsConcession_ConcessionId",
                table: "savingsConcession",
                column: "ConcessionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "emissionFactor");

            migrationBuilder.DropTable(
                name: "energyConsumption");

            migrationBuilder.DropTable(
                name: "savingsConcession");

            migrationBuilder.DropTable(
                name: "energy");

            migrationBuilder.DropTable(
                name: "concession");

            migrationBuilder.DropTable(
                name: "savings");

            migrationBuilder.DropTable(
                name: "category");
        }
    }
}
