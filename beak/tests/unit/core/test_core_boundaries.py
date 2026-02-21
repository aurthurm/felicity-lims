from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[3]
CORE_ROOT = REPO_ROOT / "beak" / "modules" / "core"


def _iter_core_python_files():
    return [path for path in CORE_ROOT.rglob("*.py") if path.is_file()]


def test_core_has_no_imports_to_non_core_modules() -> None:
    disallowed = ("from beak.modules.clinical", "from beak.modules.platform")
    offenders: list[str] = []

    for path in _iter_core_python_files():
        text = path.read_text(encoding="utf-8")
        for needle in disallowed:
            if needle in text:
                offenders.append(f"{path.relative_to(REPO_ROOT)}: contains '{needle}'")

    assert not offenders, "Core module boundary violations:\n" + "\n".join(offenders)


def test_core_has_no_patient_foreign_keys_or_patient_relationships() -> None:
    disallowed = ('ForeignKey("patient.uid")', 'relationship("Patient"')
    offenders: list[str] = []

    for path in _iter_core_python_files():
        text = path.read_text(encoding="utf-8")
        for needle in disallowed:
            if needle in text:
                offenders.append(f"{path.relative_to(REPO_ROOT)}: contains '{needle}'")

    assert not offenders, "Core patient-coupling violations:\n" + "\n".join(offenders)
